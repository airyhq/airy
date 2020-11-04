#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

service=$1
port=$2
delay=$3
name=$4

while ! nc -z ${service} ${port}; do sleep ${delay}; echo "Waiting for ${name} to start..."; done
