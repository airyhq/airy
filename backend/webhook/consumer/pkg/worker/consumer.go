package worker

import (
	"context"
	"encoding/binary"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/Shopify/sarama"
	"github.com/riferrei/srclient"
)

type Consumer struct {
	ready                chan bool
	webhookConfigStream  chan string
	schemaRegistryClient *srclient.SchemaRegistryClient
	kafkaConsumerConfig  KafkaConsumerConfig
}

type KafkaConsumerConfig struct {
	Brokers, SchemaRegistryURL, Topic, Group string
	Partitions                               int
}

func StartKafkaConsumer(
	ctx context.Context,
	wg *sync.WaitGroup,
	webhookConfigStream chan string,
	kafkaConsumerConfig KafkaConsumerConfig,
) {
	defer wg.Done()
	config := sarama.NewConfig()
	config.Consumer.Offsets.Initial = sarama.OffsetOldest

	schemaRegistryClient := srclient.CreateSchemaRegistryClient(kafkaConsumerConfig.SchemaRegistryURL)

	consumer := Consumer{
		ready:                make(chan bool),
		webhookConfigStream:  webhookConfigStream,
		schemaRegistryClient: schemaRegistryClient,
		kafkaConsumerConfig:  kafkaConsumerConfig,
	}

	client, err := sarama.NewConsumerGroup(strings.Split(kafkaConsumerConfig.Brokers, ","), kafkaConsumerConfig.Group, config)
	if err != nil {
		log.Panicf("Error creating consumer group client: %v", err)
	}

	go func() {
		for {
			if err := client.Consume(ctx, strings.Split(kafkaConsumerConfig.Topic, ","), &consumer); err != nil {
				log.Panicf("Error from consumer: %v", err)
			}
			if ctx.Err() != nil {
				return
			}
			consumer.ready = make(chan bool)
		}
	}()

	<-consumer.ready
	log.Println("Sarama consumer up and running!...")

	<-ctx.Done()
	log.Println("terminating consumer: context cancelled")
	if err = client.Close(); err != nil {
		log.Panicf("Error closing client: %v", err)
	}
}

func (consumer *Consumer) Setup(session sarama.ConsumerGroupSession) error {
	for p := 0; p < consumer.kafkaConsumerConfig.Partitions; p++ {
		session.ResetOffset(consumer.kafkaConsumerConfig.Topic, int32(p), 0, "")
	}
	close(consumer.ready)
	return nil
}

func (consumer *Consumer) Cleanup(sarama.ConsumerGroupSession) error {
	return nil
}

func (consumer *Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for config := range claim.Messages() {
		consumer.publishWebhookConfig(config)
		session.MarkMessage(config, "")
	}
	return nil
}

func (consumer *Consumer) publishWebhookConfig(config *sarama.ConsumerMessage) {
	schemaID := binary.BigEndian.Uint32(config.Value[1:5])
	schema, err := consumer.schemaRegistryClient.GetSchema(int(schemaID))
	if err != nil {
		panic(fmt.Sprintf("Error getting the schema with id '%d' %s", schemaID, err))
	}
	native, _, _ := schema.Codec().NativeFromBinary(config.Value[5:])
	value, _ := schema.Codec().TextualFromNative(nil, native)

	consumer.webhookConfigStream <- string(value)
}
