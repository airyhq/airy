package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
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

	// Produce the message
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

func sendMessage(message string, conversationId string, systemToken string, debug bool) (int, string, error) {
	messageContent := messageContent{
		Text:  message,
		Debug: debug,
	}
	messageToSend := ApplicationCommunicationSendMessage{
		ConversationID: conversationId,
		Message:        messageContent,
	}
	messageJSON, err := json.Marshal(messageToSend)
	if err != nil {
		fmt.Printf("Error encoding response to JSON: %v\n", err)
		return 0, "", errors.New("The message could not be encoded to JSON for sending.")
	}

	req, err := http.NewRequest("POST", "http://api-communication/messages.send", bytes.NewReader(messageJSON))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return 0, "", errors.New("The message could not be sent.")
	}
	req.Header.Add("Authorization", "Bearer "+systemToken)
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending POST request: %v\n", err)
		return 0, "", errors.New("Error sending POST request.")
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return 0, "", errors.New("Error reading response body.")
	}

	var response SendMessageResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Println("Error unmarshaling response:", err)
		return 0, "", errors.New("Response couldn't be unmarshaled.")
	}

	fmt.Printf("Message sent with status code: %d\n", resp.StatusCode)
	return resp.StatusCode, response.ID, nil
}

func sendFlinkSQLConfluent(url string, statementSet FlinkStatementSet, connection ConfluentConnection) (string, error) {
	timestamp := time.Now().Unix()
	strTimestamp := fmt.Sprintf("%d", timestamp)
	statementName := "airy-" + strTimestamp
	payload := ConfluentFlink{
		Name: statementName,
		Spec: ConfluentFlinkSpec{
			Statement:     statementSet.Statements[0],
			ComputePoolID: connection.ComputePoolID,
			Principal:     connection.Principal,
			Properties: FlinkSpecProperties{
				SQLCurrentCatalog:  connection.SQLCurrentCatalog,
				SQLCurrentDatabase: connection.SQLCurrentDatabase,
			},
			Stopped: false,
		},
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewReader(payloadBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Add("Authorization", "Basic "+connection.Token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body from the API: %v", err)
	}
	fmt.Println("Statement submitted. Response: ", string(body))
	var statementResponse ConfluentFlinkStatementResponse
	if err := json.Unmarshal(body, &statementResponse); err != nil {
		fmt.Printf("Error unmarshaling message: %v\n", err)
		return "", err
	}
	fmt.Printf("Check status on: %s/%s\n", url, statementName)
	defer resp.Body.Close()

	return statementName, nil
}

func getFlinkResult(url, sessionID string) (FlinkResult, error) {
	fmt.Println("The Flink session is: ", sessionID)
	payload := FlinkSQLRequest{
		Statement: "select * from output;",
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return FlinkResult{}, err
	}

	req, err := http.NewRequest("POST", url+"/v1/sessions/"+sessionID+"/statements/", bytes.NewReader(payloadBytes))
	if err != nil {
		return FlinkResult{}, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return FlinkResult{}, err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body from the API: %v", err)
	}
	fmt.Println("Statement submitted. Response: ", string(body))
	var statementResponse FlinkStatementResponse
	if err := json.Unmarshal(body, &statementResponse); err != nil {
		fmt.Printf("Error unmarshaling message: %v\n", err)
		return FlinkResult{}, err
	}

	fmt.Printf("Fetching result from: %s/v1/sessions/%s/operations/%s/result/0\n", url, sessionID, statementResponse.OperationHandle)
	time.Sleep(20 * time.Second)
	req, err = http.NewRequest("GET", url+"/v1/sessions/"+sessionID+"/operations/"+statementResponse.OperationHandle+"/result/0", nil)
	if err != nil {
		return FlinkResult{}, err
	}
	req.Header.Set("Content-Type", "application/json")

	client = &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		return FlinkResult{}, err
	}
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body from the API: %v", err)
	}
	fmt.Println("Statement submitted. Response: ", string(body))
	var flinkResultResponse FlinkResultResponse
	if err := json.Unmarshal(body, &flinkResultResponse); err != nil {
		fmt.Printf("Error unmarshaling message: %v\n", err)
		return FlinkResult{}, err
	}
	defer resp.Body.Close()

	if flinkResultResponse.Errors != nil {
		statementError := errors.New(strings.Join(flinkResultResponse.Errors, ","))
		return FlinkResult{}, statementError
	}
	return flinkResultResponse.Results, nil
}

func markdown(message string) (string, error) {
	return message, nil
}

func convertResultToMarkdown(result FlinkResult) (string, error) {
	var builder strings.Builder

	if len(result.Columns) == 0 {
		return "", errors.New("No columns found for generating the Markdown table.")
	}
	for _, col := range result.Columns {
		builder.WriteString("| " + col.Name + " ")
	}
	builder.WriteString("|\n")

	for range result.Columns {
		builder.WriteString("|---")
	}
	builder.WriteString("|\n")

	for _, d := range result.Data {
		for _, field := range d.Fields {
			builder.WriteString(fmt.Sprintf("| %v ", field))
		}
		builder.WriteString("|\n")
	}

	return builder.String(), nil
}

func getFlinkResultConfluent(url, sessionID string, connection ConfluentConnection) ([]string, string, error) {
	req, err := http.NewRequest("GET", url+"/"+sessionID, bytes.NewReader([]byte("")))
	if err != nil {
		return []string{}, "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Add("Authorization", "Basic "+connection.Token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []string{}, "", err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body from the API: %v", err)
	}
	fmt.Println("Statement submitted. Response: ", string(body))
	var statementResponse ConfluentFlinkStatementResponse
	if err := json.Unmarshal(body, &statementResponse); err != nil {
		fmt.Printf("Error unmarshaling message: %v\n", err)
		return []string{}, "", err
	}
	fmt.Printf("Received result for statement: %s\n", sessionID)
	fmt.Println("Phase: ", statementResponse.Status.Phase, " Detail: ", statementResponse.Status.Detail)
	defer resp.Body.Close()

	if statementResponse.Status.Phase == "RUNNING" || statementResponse.Status.Phase == "COMPLETED" {
		columns, err := getColumnNames(statementResponse.Status.ResultSchema)
		if err != nil {
			fmt.Println("Extracting of the column names failed.")
			return []string{}, "", err
		}
		req, err := http.NewRequest("GET", url+"/"+sessionID+"/results", bytes.NewReader([]byte("")))
		if err != nil {
			return []string{}, "", err
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Add("Authorization", "Basic "+connection.Token)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return []string{}, "", err
		}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Error reading response body from the API: %v", err)
		}
		fmt.Println("Statement submitted. Response: ", string(body))
		var result ConfluentFlinkResultsResponse
		if err := json.Unmarshal(body, &result); err != nil {
			fmt.Printf("Error unmarshaling message: %v\n", err)
			return []string{}, "", err
		}
		nextResult := result.Metadata.Next
		fmt.Println("Next result: ", nextResult)
		fmt.Println("Result: ", result.Results.Data)
		data, err := dataToString(result.Results.Data)
		if data != "" {
			return columns, data, nil
		} else {
			req, err := http.NewRequest("GET", nextResult, bytes.NewReader([]byte("")))
			if err != nil {
				return []string{}, "", err
			}
			req.Header.Set("Content-Type", "application/json")
			req.Header.Add("Authorization", "Basic "+connection.Token)

			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				return []string{}, "", err
			}
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				fmt.Println("Error reading response body from the API: %v", err)
			}
			fmt.Println("Statement submitted. Response: ", string(body))
			var result ConfluentFlinkResultsResponse
			if err := json.Unmarshal(body, &result); err != nil {
				fmt.Printf("Error unmarshaling message: %v\n", err)
				return []string{}, "", err
			}
			data, err := dataToString(result.Results.Data)
			return columns, data, err
		}
	} else {
		err := errors.New("Flink statement failed. Status: " + statementResponse.Status.Phase)
		return []string{}, "", err
	}
}

func dataToString(data interface{}) (string, error) {
	if slice, ok := data.([]interface{}); ok && len(slice) > 0 {
		dataBytes, err := json.Marshal(data)
		if err != nil {
			return "", err
		}
		return string(dataBytes), nil
	}
	return "", nil
}

func convertConfluentResultToMarkdown(headerNames []string, jsonStr string) (string, error) {
	var dataRows []ConfluentDataRow
	err := json.Unmarshal([]byte(jsonStr), &dataRows)
	if err != nil {
		return "", err
	}

	var sb strings.Builder

	header := generateMarkdownHeader(headerNames)
	sb.WriteString(header)
	sb.WriteString("\n")

	separator := strings.Repeat("| --- ", strings.Count(header, "|")-1) + "|"
	sb.WriteString(separator)
	sb.WriteString("\n")

	for _, dataRow := range dataRows {
		sb.WriteString("|")
		for _, cell := range dataRow.Row {
			sb.WriteString(" ")
			sb.WriteString(cell)
			sb.WriteString(" |")
		}
		sb.WriteString("\n")
	}

	return sb.String(), nil
}

func extractColumnNames(jsonStr string) ([]string, error) {
	var schema ConfluentResultSchema
	err := json.Unmarshal([]byte(jsonStr), &schema)
	if err != nil {
		return nil, err
	}

	var columnNames []string
	for _, column := range schema.Columns {
		columnNames = append(columnNames, column.Name)
	}

	return columnNames, nil
}

func generateMarkdownHeader(columnNames []string) string {
	var header string

	for _, name := range columnNames {
		header += "| " + name + " "
	}
	header += "|"

	return header
}

func ResultsToString(rs ConfluentResultSchema) string {
	var columnNames []string
	for _, column := range rs.Columns {
		columnNames = append(columnNames, column.Name)
	}
	return strings.Join(columnNames, ", ")
}

func getColumnNames(schema ConfluentResultSchema) ([]string, error) {
	var columnNames []string
	for _, column := range schema.Columns {
		columnNames = append(columnNames, column.Name)
	}
	return columnNames, nil
}
