build:
	docker build -t schema-registry .

release: build
	docker tag schema-registry ghcr.io/airyhq/infrastructure/schema-registry:3.4.5
	docker push ghcr.io/airyhq/infrastructure/schema-registry:3.4.5
