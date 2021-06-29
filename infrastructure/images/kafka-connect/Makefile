build:
	docker build -t airy-kafka-connect .

release: build
	docker tag airy-kafka-connect ghcr.io/airyhq/infrastructure/kafka-connect:2.7.0
	docker push ghcr.io/airyhq/infrastructure/kafka-connect:2.7.0
