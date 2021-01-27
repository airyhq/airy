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
    yq eval '.global.appImageTag="'${AIRY_VERSION}'"' -i ${INFRASTRUCTURE_PATH}/airy.yaml
    helm install core ${INFRASTRUCTURE_PATH}/helm-chart/ --values ${INFRASTRUCTURE_PATH}/airy.yaml --set global.ngrokEnabled=${NGROK_ENABLED} --timeout 1000s > /dev/null 2>&1
    wget -qnv https://airy-core-binaries.s3.amazonaws.com/${AIRY_VERSION}/alpine/amd64/airy.gz
    gunzip airy.gz
    chmod +x airy
    mv airy /usr/local/bin/
    airy init
    airy config apply --kube-config /etc/rancher/k3s/k3s.yaml --config ${INFRASTRUCTURE_PATH}/airy.yaml
else
    helm install core ${INFRASTRUCTURE_PATH}/helm-chart/ --set global.appImageTag=${AIRY_VERSION} --set global.ngrokEnabled=${NGROK_ENABLED} --timeout 1000s > /dev/null 2>&1
fi

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
