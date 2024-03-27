build-statements-executor:
	docker build -t flink-connector/statements-executor -f Dockerfile.statements-executor .

release-statements-executor: build-statements-executor
	docker tag flink-connector/statements-executor ghcr.io/airyhq/connectors/flink/statements-executor:release
	docker push ghcr.io/airyhq/connectors/flink/statements-executor:release

build-result-sender:
	docker build -t flink-connector/result-sender -f Dockerfile.result-sender .

release-result-sender: build-result-sender
	docker tag flink-connector/result-sender ghcr.io/airyhq/connectors/flink/result-sender:release
	docker push ghcr.io/airyhq/connectors/flink/result-sender:release
