build:
	docker build -t flink-connector/statements-executor .

release: build
	docker tag flink-connector/statements-executor ghcr.io/airyhq/connectors/flink/statements-executor:release
	docker push ghcr.io/airyhq/connectors/flink/statements-executor:release
