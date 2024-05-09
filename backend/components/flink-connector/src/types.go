package main

type ApplicationCommunicationSendMessage struct {
	ConversationID string            `json:"conversation_id"`
	Message        messageContent    `json:"message"`
	Metadata       map[string]string `json:"metadata"`
}

type messageContent struct {
	Text  string `json:"text"`
	Debug bool   `json:"debug"`
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
	Errors        []string    `json:"errors"`
}

type ConfluentFlink struct {
	Name string             `json:"name"`
	Spec ConfluentFlinkSpec `json:"spec"`
}

type ConfluentFlinkSpec struct {
	Statement     string              `json:"statement"`
	ComputePoolID string              `json:"compute_pool_id"`
	Principal     string              `json:"principal"`
	Properties    FlinkSpecProperties `json:"properties"`
	Stopped       bool                `json:"stopped"`
}

type FlinkSpecProperties struct {
	SQLCurrentCatalog  string `json:"sql.current-catalog"`
	SQLCurrentDatabase string `json:"sql.current-database"`
}

type ConfluentFlinkStatementResponse struct {
	Name   string                        `json:"name"`
	Status ConfluentFlinkStatementStatus `json:"status"`
}

type ConfluentFlinkStatementStatus struct {
	Detail       string                `json:"detail"`
	Phase        string                `json:"phase"`
	ResultSchema ConfluentResultSchema `json:"result_schema"`
}

type ConfluentResultSchema struct {
	Columns []struct {
		Name string `json:"name"`
	} `json:"columns"`
}

type ConfluentFlinkResultsResponse struct {
	Metadata ResultResponseMetadata `json:"metadata"`
	Results  ResultResponseResults  `json:"results"`
}

type ResultResponseMetadata struct {
	CreatedAt string `json:"created_at"`
	Next      string `json:"next"`
	Self      string `json:"self"`
}

type ResultResponseResults struct {
	Data interface{} `json:"data"`
}

type ConfluentDataRow struct {
	Op  int      `json:"op"`
	Row []string `json:"row"`
}

type FlinkStatementSet struct {
	Statements     []string `json:"statements"`
	Question       string   `json:"question"`
	MessageID      string   `json:"message_id"`
	ConversationID string   `json:"conversation_id"`
}

type ConfluentConnection struct {
	Token              string
	ComputePoolID      string
	Principal          string
	SQLCurrentCatalog  string
	SQLCurrentDatabase string
}
