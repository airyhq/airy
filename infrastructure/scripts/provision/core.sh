#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
INFRASTRUCTURE_PATH=$(cd ${SCRIPT_PATH}/../../; pwd -P)

source ${INFRASTRUCTURE_PATH}/scripts/lib/k8s.sh


cd ${INFRASTRUCTURE_PATH}/scripts/
wait-for-service-account

if [ -z ${AIRY_VERSION+x} ]; then
    branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
    branch_name="(unnamed branch)"     # detached HEAD

    branch_name=${branch_name##refs/heads/}
    case "$branch_name" in
        main|release* )
            AIRY_VERSION=(`cat ../../VERSION`)
            ;;
        * )
            AIRY_VERSION=develop
            ;;
    esac
fi

echo "Deploying the Airy Core Platform with the ${AIRY_VERSION} image tag"

helm install core ${INFRASTRUCTURE_PATH}/helm-chart/ --values ${INFRASTRUCTURE_PATH}/airy.yaml --set global.appImageTag=${AIRY_VERSION} --version 0.5.0 --timeout 1000s #> /dev/null 2>&1

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
