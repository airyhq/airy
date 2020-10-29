#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

kubectl delete pod $(kubectl get pods | grep -v NAME | awk '{ print $1; }') 2>/dev/null
