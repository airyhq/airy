package payloads

type KsqlRequestPayload struct {
	Ksql                string            `json:"ksql"`
	StreamingProperties map[string]string `json:"streamingProperties"`
}

type KsqlGetStreamsResponsePayload []struct {
	Type          string `json:"@type"`
	StatementText string `json:"statementText"`
	Streams       []struct {
		Type        string `json:"type"`
		Name        string `json:"name"`
		Topic       string `json:"topic"`
		KeyFormat   string `json:"keyFormat"`
		ValueFormat string `json:"valueFormat"`
		IsWindowed  bool   `json:"isWindowed"`
	} `json:"streams"`
	Warnings []struct {
		Message string `json:"message"`
	} `json:"warnings"`
}

type StreamsCreatePayload struct {
	Name   string `json:"name"`
	Topics []struct {
		Name   string `json:"name"`
		Fields []struct {
			Name    string `json:"name"`
			NewName string `json:"newName,omitempty"`
			NawName string `json:"nawName,omitempty"`
		} `json:"fields"`
	} `json:"topics"`
	Joins []struct {
		Name   string `json:"name"`
		Field1 string `json:"field1"`
		Field2 string `json:"field2"`
	} `json:"joins"`
	Aggregations []any  `json:"aggregations"`
	Key          string `json:"key"`
}
