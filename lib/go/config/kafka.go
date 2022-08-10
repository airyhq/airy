package config

func GetKafkaData(s KafkaConf) map[string]string {
	m := make(map[string]string)

	if s.Brokers != "" {
		m["KAFKA_BROKERS"] = s.Brokers
	}

	if s.CommitIntervalMs != "" {
		m["KAFKA_COMMIT_INTERVAL_MS"] = s.CommitIntervalMs
	}

	if s.Zookeeper != "" {
		m["ZOOKEEPER"] = s.Zookeeper
	}

	if s.SchemaRegistryUrl != "" {
		m["KAFKA_SCHEMA_REGISTRY_URL"] = s.SchemaRegistryUrl
	}

	if s.AuthJaas != "" {
		m["AUTH_JAAS"] = s.AuthJaas
	}

	if s.MinimumReplicas != "" {
		m["KAFKA_MINIMUM_REPLICAS"] = s.MinimumReplicas
	}

	return m
}
