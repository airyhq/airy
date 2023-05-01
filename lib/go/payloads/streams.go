package payloads

type KsqlGetStreamsRequestPayload struct {
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
