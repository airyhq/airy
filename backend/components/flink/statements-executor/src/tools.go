package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

func sendFlinkSQL(url string, statementSet FlinkStatementSet) (string, error) {
	timestamp := time.Now().Unix()
	strTimestamp := fmt.Sprintf("%d", timestamp)
	replacements := map[string]string{
		"{PROPERTIES_GROUP_ID}":          "flink-" + strTimestamp,
		"{PROPERTIES_BOOTSTRAP_SERVERS}": os.Getenv("KAFKA_BROKERS"),
		"{PROPERTIES_SASL_JAAS_CONFIG}":  fmt.Sprintf("org.apache.flink.kafka.shaded.org.apache.kafka.common.security.plain.PlainLoginModule required username=\"%s\" password=\"%s\";", os.Getenv("AUTH_JAAS_USERNAME"), os.Getenv("AUTH_JAAS_PASSWORD")),
	}
	for i, stmt := range statementSet.Statements {
		for placeholder, value := range replacements {
			stmt = strings.Replace(stmt, placeholder, value, -1)
		}
		statementSet.Statements[i] = stmt
	}
	fmt.Println("Updated StatementSet: %+v\n", statementSet.Statements)

	// Create a sessionHandle
	req, err := http.NewRequest("POST", url+"/v1/sessions/", bytes.NewReader([]byte("")))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body from the API: %v", err)
	}
	fmt.Println("Response: ", string(body))
	var sessionResponse FlinkSessionResponse
	if err := json.Unmarshal(body, &sessionResponse); err != nil {
		fmt.Printf("Error unmarshaling message: %v\n", err)
		return "", err
	}
	defer resp.Body.Close()

	// Create the SQL Statement
	fmt.Println("The Flink session is: ", sessionResponse.SessionHandle)
	for _, statement := range statementSet.Statements {
		payload := FlinkSQLRequest{
			Statement: statement,
		}
		payloadBytes, err := json.Marshal(payload)
		if err != nil {
			return "", err
		}

		req, err = http.NewRequest("POST", url+"/v1/sessions/"+sessionResponse.SessionHandle+"/statements/", bytes.NewReader(payloadBytes))
		if err != nil {
			return "", err
		}
		req.Header.Set("Content-Type", "application/json")

		client = &http.Client{}
		resp, err = client.Do(req)
		if err != nil {
			return "", err
		}
		body, err = io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Error reading response body from the API: %v", err)
		}
		fmt.Println("Statement submitted. Response: ", string(body))
		var statementResponse FlinkStatementResponse
		if err := json.Unmarshal(body, &statementResponse); err != nil {
			fmt.Printf("Error unmarshaling message: %v\n", err)
			return "", err
		}
		fmt.Printf("Check status on: %s/v1/sessions/%s/operations/%s/result/0\n", url, sessionResponse.SessionHandle, statementResponse.OperationHandle)
		defer resp.Body.Close()
	}

	return sessionResponse.SessionHandle, nil
}

func produceFlinkOutput(flinkOutput FlinkOutput, kafkaURL, groupID, authUsername, authPassword string) error {

	kafkaTopic := "flink.outputs"

	flinkOutputJSON, err := json.Marshal(flinkOutput)
	if err != nil {
		return fmt.Errorf("error marshaling query to JSON: %w", err)
	}

	configMap := kafka.ConfigMap{
		"bootstrap.servers": kafkaURL,
	}
	if authUsername != "" && authPassword != "" {
		configMap.SetKey("security.protocol", "SASL_SSL")
		configMap.SetKey("sasl.mechanisms", "PLAIN")
		configMap.SetKey("sasl.username", authUsername)
		configMap.SetKey("sasl.password", authPassword)
	}

	producer, err := kafka.NewProducer(&configMap)
	if err != nil {
		return fmt.Errorf("failed to create producer: %w", err)
	}
	defer producer.Close()

	message := kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &kafkaTopic, Partition: kafka.PartitionAny},
		Key:            []byte(flinkOutput.SessionID),
		Value:          flinkOutputJSON,
	}

	err = producer.Produce(&message, nil)
	if err != nil {
		return fmt.Errorf("failed to produce message: %w", err)
	}
	fmt.Println("message scheduled for production")
	producer.Flush(15 * 1000)
	fmt.Println("message flushed")
	return nil
}
