#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

kubectl scale --replicas=0 deployment -l boxImage="no"

kubectl get pods --field-selector=status.phase=Terminating
while [ `kubectl get pods --field-selector=status.phase=Terminating 2>/dev/null | wc -l` -gt 0 ]
do 
    echo "Waiting for pods to terminate..."
    sleep 1
done

docker image prune -f -a
