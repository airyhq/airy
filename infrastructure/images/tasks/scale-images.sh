#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

kubectl scale --replicas=0 deployment -l boxImage="no"
docker rmi -f $(docker images | grep airyhq | awk '{ print $3; }')
