package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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
	flinkProvider := os.Getenv("provider")
	groupID := "result-sender"
	msgNormal := false
	msgDebug := true

	if kafkaURL == "" || schemaRegistryURL == "" || topicName == "" {
		fmt.Println("KAFKA_BROKERS, KAFKA_SCHEMA_REGISTRY_URL, and KAFKA_TOPIC_NAME environment variables must be set")
		return
	}

	var confluentConnection ConfluentConnection
	confluentConnection.Token = os.Getenv("confluentToken")
	confluentConnection.ComputePoolID = os.Getenv("confluentComputePoolID")
	confluentConnection.Principal = os.Getenv("confluentPrincipal")
	confluentConnection.SQLCurrentCatalog = os.Getenv("confluentSQLCurrentCatalog")
	confluentConnection.SQLCurrentDatabase = os.Getenv("confluentSQLCurrentDatabase")

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

						flinkGatewayURL := os.Getenv("FLINK_GATEWAY_URL")
						confluentGatewayURL := os.Getenv("CONFLUENT_GATEWAY_URL")

						var result FlinkResult
						var headerConfluent []string
						var resultConfluent string

						if flinkProvider == "flink" {
							fmt.Println("Flink gateway: ", flinkGatewayURL)
							result, err = getFlinkResult(flinkGatewayURL, flinkOutput.SessionID)
							headerConfluent = []string{}
						} else {
							fmt.Println("Flink gateway: ", confluentGatewayURL)
							fmt.Println("Waiting 20 seconds...")
							time.Sleep(20 * time.Second)
							headerConfluent, resultConfluent, err = getFlinkResultConfluent(confluentGatewayURL, flinkOutput.SessionID, confluentConnection)
						}
						if err != nil {
							fmt.Println("Unable to get Flink result:", err)
							sendMessage("Error: "+err.Error(), flinkOutput.ConversationID, systemToken, msgDebug)
							return
						}
						if flinkProvider == "flink" {
							sendMessage("Result retrieved from Flink: "+fmt.Sprintf("%#v", result), flinkOutput.ConversationID, systemToken, msgDebug)
							sendMessage("Now converting the result to Markdown", flinkOutput.ConversationID, systemToken, msgDebug)
							response, err := convertResultToMarkdown(result)
							if err != nil {
								fmt.Println("Unable to generate Markdown from result:", err)
								sendMessage("Error: "+err.Error(), flinkOutput.ConversationID, systemToken, msgDebug)
								sendMessage("I'm sorry, I am unable to fetch the results from the Flink table.", flinkOutput.ConversationID, systemToken, msgNormal)
								return
							}
							sendMessage(response, flinkOutput.ConversationID, systemToken, msgNormal)
						} else {
							sendMessage("Result retrieved from Flink: "+fmt.Sprintf("%#v", resultConfluent), flinkOutput.ConversationID, systemToken, msgDebug)
							sendMessage("Now converting the result to Markdown", flinkOutput.ConversationID, systemToken, msgDebug)
							response, err := convertConfluentResultToMarkdown(headerConfluent, resultConfluent)
							if err != nil {
								fmt.Println("Unable to generate Markdown from result:", err)
								sendMessage("Error: "+err.Error(), flinkOutput.ConversationID, systemToken, msgDebug)
								sendMessage("I'm sorry, I am unable to fetch the results from the Flink table.", flinkOutput.ConversationID, systemToken, msgNormal)
								return
							}
							sendMessage(response, flinkOutput.ConversationID, systemToken, msgNormal)
						}
					}
				} else {
					fmt.Printf("Consumer error: %v\n", err)
				}
			}
		}
	}()
	<-done
	c.Close()
	fmt.Println("Consumer closed")
}
