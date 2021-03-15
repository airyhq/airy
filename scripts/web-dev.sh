#!/bin/bash
set -eo pipefail
set -o xtrace
IFS=$'\n\t'

echo "web target to run: $1"
endpoint=$(minikube -p airy-core -n kube-system service --url traefik| sed -e "s/http:\/\///")
echo "minikube api endpoint: ${endpoint}"
echo "starting devserver with ibazel"
ibazel run $1 -- --defines="{\"process.env.API_HOST\":\"'$endpoint'\"}"
