build:
	docker build -t busybox .

release: build
	docker tag busybox ghcr.io/airyhq/infrastructure/busybox
	docker push ghcr.io/airyhq/infrastructure/busybox
