build:
	docker build -t airy-kafka .

release: build
	docker tag airy-kafka ghcr.io/airyhq/infrastructure/kafka:2.7.0
	docker push ghcr.io/airyhq/infrastructure/kafka:2.7.0
