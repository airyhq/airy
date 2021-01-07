build:
	docker build -t schema-registry . --build-arg SCHEMA_REGISTRY_VERSION=${SCHEMA_REGISTRY_VERSION}

release-beta: build
	docker tag schema-registry ghcr.io/airyhq/infrastructure/schema-registry:beta
	docker push ghcr.io/airyhq/infrastructure/schema-registry:beta

release: build
	docker tag schema-registry ghcr.io/airyhq/infrastructure/schema-registry:release
	docker push ghcr.io/airyhq/infrastructure/schema-registry:release
