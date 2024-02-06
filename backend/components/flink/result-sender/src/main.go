package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

func main() {

	// Create Kafka consumer to read the statements
	kafkaURL := os.Getenv("KAFKA_BROKERS")
	schemaRegistryURL := os.Getenv("KAFKA_SCHEMA_REGISTRY_URL")
	topicName := os.Getenv("KAFKA_TOPIC_NAME")
	systemToken := os.Getenv("systemToken")
	authUsername := os.Getenv("AUTH_JAAS_USERNAME")
	authPassword := os.Getenv("AUTH_JAAS_PASSWORD")
	//timestamp := time.Now().Unix()
	//strTimestamp := fmt.Sprintf("%d", timestamp)
	groupID := "result-sender" //+ "-" + strTimestamp

	if kafkaURL == "" || schemaRegistryURL == "" || topicName == "" {
		fmt.Println("KAFKA_BROKERS, KAFKA_SCHEMA_REGISTRY_URL, and KAFKA_TOPIC_NAME environment variables must be set")
		return
	}

	// Healthcheck
	http.HandleFunc("/actuator/health", func(w http.ResponseWriter, r *http.Request) {
		response := map[string]string{"status": "UP"}
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	})

	go func() {
		if err := http.ListenAndServe(":80", nil); err != nil {
			panic(err)
		}
	}()

	fmt.Println("Health-check started")

	// Create Kafka consumer configuration
	fmt.Println("Creating Kafka consumer for topic: ", topicName)

	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": kafkaURL,
		"group.id":          groupID,
		"auto.offset.reset": "earliest",
		"security.protocol": "SASL_SSL",
		"sasl.mechanisms":   "PLAIN",
		"sasl.username":     authUsername,
		"sasl.password":     authPassword,
	})
	if err != nil {
		fmt.Printf("Error creating consumer: %v\n", err)
		return
	}
	c.SubscribeTopics([]string{topicName}, nil)
	// Channel for signals
	signals := make(chan os.Signal, 1)
	done := make(chan bool, 1)

	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)

	go func() {
		for {
			select {
			case sig := <-signals:
				// If an interrupt signal is received, break the loop
				fmt.Printf("Caught signal %v: terminating\n", sig)
				done <- true
				return
			default:
				msg, err := c.ReadMessage(-1)
				if err == nil {
					var flinkOutput FlinkOutput
					if err := json.Unmarshal(msg.Value, &flinkOutput); err != nil {
						fmt.Printf("Error unmarshalling message: %v\n", err)
						continue
					} else {
						fmt.Printf("Received message: %+v\n", flinkOutput)

						flinkGatewayURL := "http://flink-jobmanager:8083" //"http://flink.us-east-2.aws.confluent.cloud/v1beta1/sql", Replace with your Flink Gateway URL https://flink.region.provider.confluent.cloud
						fmt.Println("Flink gateway: ", flinkGatewayURL)
						result, err := getFlinkResult(flinkGatewayURL, flinkOutput.SessionID)
						if err != nil {
							fmt.Println("Unable to get Flink result:", err)
							return
						}
						response, err := convertResultToMarkdown(result)
						if err != nil {
							fmt.Println("Unable to generate Markdown from result:", err)
							sendMessage("I'm sorry, I am unable to fetch the results from the Flink table.", flinkOutput.ConversationID, systemToken)
							return
						}
						sendMessage(response, flinkOutput.ConversationID, systemToken)
					}
				} else {
					// Log the error and continue
					fmt.Printf("Consumer error: %v\n", err)
				}
			}
		}
	}()
	<-done
	c.Close()
	fmt.Println("Consumer closed")
}
