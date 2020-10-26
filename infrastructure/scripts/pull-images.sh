#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker pull confluentinc/cp-kafka:5.5.0
docker pull confluentinc/cp-zookeeper:5.5.0
docker pull postgres:12.4
docker pull redis:5.0.1-alpine
