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

	kafkaURL := os.Getenv("KAFKA_BROKERS")
	schemaRegistryURL := os.Getenv("KAFKA_SCHEMA_REGISTRY_URL")
	topicName := os.Getenv("KAFKA_TOPIC_NAME")
	systemToken := os.Getenv("systemToken")
	authUsername := os.Getenv("AUTH_JAAS_USERNAME")
	authPassword := os.Getenv("AUTH_JAAS_PASSWORD")
	flinkProvider := os.Getenv("flnkProvider")
	groupID := "statement-executor-"
	msgNormal := false
	msgDebug := true

	if kafkaURL == "" || schemaRegistryURL == "" || topicName == "" {
		fmt.Println("KAFKA_BROKERS, KAFKA_SCHEMA_REGISTRY_URL, and KAFKA_TOPIC_NAME environment variables must be set")
		return
	}

	var confluentConnection ConfluentConnection
	confluentConnection.Token = os.Getenv("CONFLUENT_TOKEN")
	confluentConnection.ComputePoolID = os.Getenv("CONFLUENT_COMPUTE_POOL_ID")
	confluentConnection.Principal = os.Getenv("CONFLUENT_PRINCIPAL")
	confluentConnection.SQLCurrentCatalog = os.Getenv("CONFLUENT_SQL_CURRENT_CATALOG")
	confluentConnection.SQLCurrentDatabase = os.Getenv("CONFLUENT_SQL_CURRENT_DATABASE")

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
				fmt.Printf("Caught signal %v: terminating\n", sig)
				done <- true
				return
			default:
				msg, err := c.ReadMessage(-1)
				if err == nil {
					var statementSet FlinkStatementSet
					if err := json.Unmarshal(msg.Value, &statementSet); err != nil {
						fmt.Printf("Error unmarshalling message: %v\n", err)
						continue
					} else {
						fmt.Printf("Received message: %+v\n", statementSet)

						flinkGatewayURL := os.Getenv("FLINK_GATEWAY_URL")
						confluentGatewayURL := os.Getenv("CONFLUENT_GATEWAY_URL")
						var sessionID string
						if flinkProvider == "flink" {
							sessionID, err = sendFlinkSQL(flinkGatewayURL, statementSet)
						} else {
							sessionID, err = sendFlinkSQLConfluent(confluentGatewayURL, statementSet, confluentConnection)
						}

						if err != nil {
							fmt.Println("Error running Flink statement:", err)
							sendMessage("Error: "+err.Error(), statementSet.ConversationID, systemToken, msgDebug)
							sendMessage("I am sorry, I am unable to answer that question.", statementSet.ConversationID, systemToken, msgNormal)
							return
						}
						fmt.Println("Successfully executed the Flink statement.")
						sendMessage("FlinkSessionID: "+sessionID, statementSet.ConversationID, systemToken, msgDebug)
						var flinkOutput FlinkOutput
						flinkOutput.SessionID = sessionID
						flinkOutput.Question = statementSet.Question
						flinkOutput.MessageID = statementSet.MessageID
						flinkOutput.ConversationID = statementSet.ConversationID
						err = produceFlinkOutput(flinkOutput, kafkaURL, "flink-producer-"+groupID, authUsername, authPassword)
						if err != nil {

							fmt.Printf("error producing message to Kafka: %v\n", err)
							sendMessage("Error: "+err.Error(), statementSet.ConversationID, systemToken, msgDebug)
							sendMessage("I am sorry, I am unable to answer that question.", statementSet.ConversationID, systemToken, msgNormal)
						}
						sendMessage("Message produced to topic: flink.outputs", statementSet.ConversationID, systemToken, msgDebug)
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
