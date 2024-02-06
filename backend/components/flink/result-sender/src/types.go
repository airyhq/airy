package main

type ApplicationCommunicationSendMessage struct {
	ConversationID string            `json:"conversation_id"`
	Message        messageContent    `json:"message"`
	Metadata       map[string]string `json:"metadata"`
}

type messageContent struct {
	Text string `json:"text"`
}

type SendMessageResponse struct {
	ID    string `json:"id"`
	State string `json:"state"`
}

type FlinkOutput struct {
	SessionID      string `json:"session_id"`
	Question       string `json:"question"`
	MessageID      string `json:"message_id"`
	ConversationID string `json:"conversation_id"`
}

// FlinkSQLRequest represents the payload for a Flink SQL request
type FlinkSQLRequest struct {
	Statement string `json:"statement"`
}

type FlinkSessionResponse struct {
	SessionHandle string `json:"sessionHandle"`
}

type FlinkStatementResponse struct {
	OperationHandle string `json:"operationHandle"`
}

type Column struct {
	Name        string `json:"name"`
	LogicalType struct {
		Type     string `json:"type"`
		Nullable bool   `json:"nullable"`
		Length   int    `json:"length,omitempty"`
	} `json:"logicalType"`
	Comment interface{} `json:"comment"`
}

type Data struct {
	Kind   string        `json:"kind"`
	Fields []interface{} `json:"fields"`
}

type FlinkResult struct {
	Columns   []Column `json:"columns"`
	RowFormat string   `json:"rowFormat"`
	Data      []Data   `json:"data"`
}

type FlinkResultResponse struct {
	ResultType    string      `json:"resultType"`
	IsQueryResult bool        `json:"isQueryResult"`
	JobID         string      `json:"jobID"`
	ResultKind    string      `json:"resultKind"`
	Results       FlinkResult `json:"results"`
	NextResultUri string      `json:"nextResultUri"`
}
