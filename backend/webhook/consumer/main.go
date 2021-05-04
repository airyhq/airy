package main

import (
	"consumer/pkg/worker"
	"context"
	"log"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"
)

func main() {
	maxBackOffSeconds, err := strconv.Atoi(os.Getenv("MAX_BACKOFF_SECONDS"))
	if err != nil {
		log.Fatal("MAX_BACKOFF_SECONDS not set")
	}

	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup

	webhookConfigStream := make(chan string)

	kafkaConsumerConfig := worker.KafkaConsumerConfig{
		Brokers:           os.Getenv("KAFKA_BROKERS"),
		SchemaRegistryURL: os.Getenv("KAFKA_SCHEMA_REGISTRY_URL"),
		Group:             "WebhookConsumer",
		Topic:             "application.communication.webhooks",
		Partitions:        10,
	}

	wg.Add(1)
	go worker.StartKafkaConsumer(ctx, &wg, webhookConfigStream, kafkaConsumerConfig)

	w, err := worker.Start(
		ctx,
		&wg,
		webhookConfigStream,
		os.Getenv("BEANSTALK_HOSTNAME"),
		os.Getenv("BEANSTALK_PORT"),
		time.Duration(maxBackOffSeconds)*time.Second,
	)
	if err != nil {
		cancel()
	}

	wg.Add(1)
	go w.StartServer(ctx, &wg)

	sigterm := make(chan os.Signal, 1)
	signal.Notify(sigterm, syscall.SIGINT, syscall.SIGTERM)

	<-sigterm
	log.Println("terminating: via signal")
	cancel()
	wg.Wait()
}
