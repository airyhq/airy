build:
	docker build -t flink-connector/result-sender .

release: build
	docker tag flink-connector/result-sender ghcr.io/airyhq/connectors/flink/result-sender:release
	docker push ghcr.io/airyhq/connectors/flink/result-sender:release
