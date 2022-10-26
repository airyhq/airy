build:
	docker build -t airy-kafka .

release: build
	docker tag airy-kafka ghcr.io/airyhq/infrastructure/kafka:3.3.1
	docker push ghcr.io/airyhq/infrastructure/kafka:3.3.1
