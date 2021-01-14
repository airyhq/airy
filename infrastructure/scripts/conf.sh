#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
INFRASTRUCTURE_PATH=$(cd ${SCRIPT_PATH}/../; pwd -P)

if [[ ! -f ${INFRASTRUCTURE_PATH}/airy.yaml ]]; then
    echo "No airy.yaml config file found"
    exit 0
fi

source /vagrant/scripts/lib/k8s.sh

source ${INFRASTRUCTURE_PATH}/scripts/lib/k8s.sh


kubectl delete pod startup-helper --force 2>/dev/null || true
kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"

helm upgrade core ${INFRASTRUCTURE_PATH}/helm-chart/ --values ${INFRASTRUCTURE_PATH}/airy.yaml --timeout 1000s > /dev/null 2>&1

kubectl scale deployment schema-registry --replicas=1

wait-for-running-pod startup-helper
wait-for-service startup-helper schema-registry 8081 15 "Schema registry"

kubectl scale deployment -l type=api --replicas=1
kubectl scale deployment -l type=sources-chatplugin --replicas=1
kubectl scale deployment -l type=frontend --replicas=1

wait-for-service startup-helper api-auth 80 10 api-auth

kubectl scale deployment -l type=sources-twilio --replicas=1
kubectl scale deployment -l type=sources-google --replicas=1
kubectl scale deployment -l type=sources-facebook --replicas=1
kubectl scale deployment -l type=webhook --replicas=1

kubectl delete pod startup-helper --force 2>/dev/null
