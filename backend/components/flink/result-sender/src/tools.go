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
)

// getFlinkResult sends an SQL statement to the Flink Gateway
func getFlinkResult(url, sessionID string) (FlinkResult, error) {
	// Create the SQL Statement
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

	// Fetch the results from the operationHandle
	fmt.Printf("Fetching result from: %s/v1/sessions/%s/operations/%s/result/0\n", url, sessionID, statementResponse.OperationHandle)
	time.Sleep(10 * time.Second)
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

	// Handle the response (check if the request was successful)
	return flinkResultResponse.Results, nil
}

func sendMessage(message string, conversationId string, systemToken string) (int, string, error) {
	apiCommunicationUrl := os.Getenv("API_COMMUNICATION_URL")
	messageContent := messageContent{
		Text: message,
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

	req, err := http.NewRequest("POST", apiCommunicationUrl, bytes.NewReader(messageJSON))
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

	// Read the response body
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

func markdown(message string) (string, error) {
	return message, nil
}

func convertResultToMarkdown(result FlinkResult) (string, error) {
	var builder strings.Builder

	// Add the header row
	if len(result.Columns) == 0 {
		return "", errors.New("No columns found for generating the Markdown table.")
	}
	for _, col := range result.Columns {
		builder.WriteString("| " + col.Name + " ")
	}
	builder.WriteString("|\n")

	// Add the separator row
	for range result.Columns {
		builder.WriteString("|---")
	}
	builder.WriteString("|\n")

	// Add the data rows
	for _, d := range result.Data {
		for _, field := range d.Fields {
			builder.WriteString(fmt.Sprintf("| %v ", field))
		}
		builder.WriteString("|\n")
	}

	return builder.String(), nil
}
