build:
	docker build -t schema-registry . --build-arg SCHEMA_REGISTRY_VERSION=${SCHEMA_REGISTRY_VERSION}

release: build
	docker tag schema-registry ghcr.io/airyhq/infrastructure/schema-registry:2.0.1
	docker push ghcr.io/airyhq/infrastructure/schema-registry:2.0.1

