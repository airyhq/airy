#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "web target to run: $1"
echo "minikube api endpoint:"
minikube -p airy-core -n kube-system service --url traefik
endpoint=$(echo minikube -p airy-core -n kube-system service --url traefik| sed -e "s/http:\/\///")
echo "starting devserver with ibazel"
ibazel run $1 -- --defines="{\"process.env.API_HOST\":\"'$endpoint'\"}"
