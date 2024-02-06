build:
	docker build -t flink .

release: build
	docker tag flink ghcr.io/airyhq/flink:release
	docker push ghcr.io/airyhq/flink:release
