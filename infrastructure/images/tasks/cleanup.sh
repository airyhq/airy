#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

minikube stop
docker rmi -f `docker images | grep airyhq | awk '{ print $3; }'` || true

sudo yum clean all

find /var/log/ -type f -exec truncate -s 0 {} \; || true
