#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
INFRASTRUCTURE_PATH=$(cd ${SCRIPT_PATH}/../../; pwd -P)

source ${INFRASTRUCTURE_PATH}/scripts/lib/k8s.sh


cd ${INFRASTRUCTURE_PATH}/scripts/
wait-for-service-account


echo "Deploying the Airy Core Platform with the ${AIRY_VERSION} image tag"

if [[ -f ${INFRASTRUCTURE_PATH}/airy.yaml ]]; then
    yq w -i ${INFRASTRUCTURE_PATH}/airy.yaml global.appImageTag ${AIRY_VERSION} 
fi

helm install core ${INFRASTRUCTURE_PATH}/helm-chart/ --set global.appImageTag=${AIRY_VERSION} --version 0.5.0 --timeout 1000s > /dev/null 2>&1

kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"

wait-for-running-pod startup-helper
wait-for-service startup-helper zookeeper 2181 15 ZooKeeper
wait-for-service startup-helper kafka 9092 15 Kafka
kubectl cp provision/create-topics.sh kafka-0:/tmp
kubectl exec kafka-0 -- /tmp/create-topics.sh

kubectl scale deployment postgres --replicas=1
wait-for-service startup-helper postgres 5432 10 Postgres

kubectl scale statefulset redis-cluster --replicas=1
wait-for-service startup-helper redis-cluster 6379 10 Redis
kubectl delete pod startup-helper --force 2>/dev/null

echo "Deploying ingress controller"
kubectl apply -f ../network/ingress.yaml
