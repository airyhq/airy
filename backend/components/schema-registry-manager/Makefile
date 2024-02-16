build:
	docker build -t schema-registry-manager .

release: build
	docker tag schema-registry-manager ghcr.io/airyhq/backend/schema-registry-manager:release
	docker push ghcr.io/airyhq/backend/schema-registry-manager:release
