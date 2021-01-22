build:
	docker build -t nginx-lua .

release: build
	docker tag nginx-lua ghcr.io/airyhq/frontend/nginx-lua:1.0.0
	docker push ghcr.io/airyhq/frontend/nginx-lua:1.0.0
