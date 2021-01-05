build:
	docker build -t airy-kafka .

release-beta: build
	docker tag airy-kafka ghcr.io/airyhq/infrastructure/kafka:beta
	docker push ghcr.io/airyhq/infrastructure/kafka:beta

release: build
	docker tag airy-kafka ghcr.io/airyhq/infrastructure/kafka:release
	docker push ghcr.io/airyhq/infrastructure/kafka:release
