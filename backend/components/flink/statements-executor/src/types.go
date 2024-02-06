package main

type FlinkStatementSet struct {
	Statements     []string `json:"statements"`
	Question       string   `json:"question"`
	MessageID      string   `json:"message_id"`
	ConversationID string   `json:"conversation_id"`
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
