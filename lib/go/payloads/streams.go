package payloads

type KsqlRequestPayload struct {
	Ksql                string            `json:"ksql"`
	StreamingProperties map[string]string `json:"streamingProperties"`
}

type KsqlResponsePayload []struct {
	Type              string `json:"@type"`
	StatementText     string `json:"statementText"`
	SourceDescription struct {
		Name         string `json:"name,omitempty"`
		WindowType   any    `json:"windowType,omitempty"`
		ReadQueries  []any  `json:"readQueries,omitempty"`
		WriteQueries []struct {
			QueryString     string   `json:"queryString,omitempty"`
			Sinks           []string `json:"sinks,omitempty"`
			SinkKafkaTopics []string `json:"sinkKafkaTopics,omitempty"`
			ID              string   `json:"id,omitempty"`
			StatusCount     struct {
				Running int `json:"RUNNING,omitempty"`
			} `json:"statusCount,omitempty"`
			QueryType string `json:"queryType,omitempty"`
			State     string `json:"state,omitempty"`
		} `json:"writeQueries,omitempty"`
		Fields []struct {
			Name   string `json:"name,omitempty"`
			Schema struct {
				Type         string `json:"type,omitempty"`
				Fields       any    `json:"fields,omitempty"`
				MemberSchema any    `json:"memberSchema,omitempty"`
			} `json:"schema,omitempty"`
			Type string `json:"type,omitempty"`
		} `json:"fields,omitempty"`
		Type                 string `json:"type,omitempty"`
		Timestamp            string `json:"timestamp,omitempty"`
		Statistics           string `json:"statistics,omitempty"`
		ErrorStats           string `json:"errorStats,omitempty"`
		Extended             bool   `json:"extended,omitempty"`
		KeyFormat            string `json:"keyFormat,omitempty"`
		ValueFormat          string `json:"valueFormat,omitempty"`
		Topic                string `json:"topic,omitempty"`
		Partitions           int    `json:"partitions,omitempty"`
		Replication          int    `json:"replication,omitempty"`
		Statement            string `json:"statement,omitempty"`
		QueryOffsetSummaries []any  `json:"queryOffsetSummaries,omitempty"`
		SourceConstraints    []any  `json:"sourceConstraints,omitempty"`
		ClusterStatistics    []any  `json:"clusterStatistics,omitempty"`
		ClusterErrorStats    []any  `json:"clusterErrorStats,omitempty"`
	} `json:"sourceDescription,omitempty"`
	Streams []struct {
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

type StreamsCreateRequestPayload struct {
	Name   string `json:"name"`
	Topics []struct {
		Name   string `json:"name"`
		Fields []struct {
			Name    string `json:"name"`
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

type StreamsCreateResponsePayload struct {
	Name        string `json:"name"`
	OutputTopic string `json:"outputTopic"`
}

type StreamsDeleteRequestPayload struct {
	Name string `json:"name"`
}

type StreamsDeleteResponsePayload struct {
	Name string `json:"name"`
}

type StreamsInfoRequestPayload struct {
	Name string `json:"name"`
}

type StreamsInfoResponsePayload struct {
	Name string `json:"name"`
	// DescribeStream struct {
	// 	Type        string `json:"type"`
	// 	Name        string `json:"name"`
	// 	Topic       string `json:"topic"`
	// 	KeyFormat   string `json:"keyFormat"`
	// 	ValueFormat string `json:"valueFormat"`
	// 	IsWindowed  bool   `json:"isWindowed"`
	// } `json:"stream"`
}
