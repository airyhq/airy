#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh

kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"
wait-for-running-pod startup-helper

kubectl scale statefulset airy-cp-zookeeper --replicas=1
wait-for-service startup-helper airy-cp-zookeeper 2181 15 Zookeeper
kubectl scale statefulset airy-cp-kafka --replicas=1
wait-for-service startup-helper airy-cp-kafka 9092 15 Kafka
kubectl scale statefulset redis-cluster --replicas=1
wait-for-service startup-helper redis-cluster 6379 10 Redis
kubectl scale deployment postgres --replicas=1
wait-for-service startup-helper postgres 5432 10 Postgres
kubectl scale deployment airy-cp-schema-registry --replicas=1
wait-for-service startup-helper airy-cp-schema-registry 8081 15 Schema-registry

echo "Starting up Airy Core Platform appplications"
kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment frontend-demo --replicas=1
kubectl scale deployment frontend-chat-plugin --replicas=1
kubectl scale deployment api-communication --replicas=1
kubectl scale deployment sources-facebook-events-router --replicas=1
kubectl scale deployment sources-facebook-sender --replicas=1
kubectl scale deployment sources-facebook-webhook --replicas=1
kubectl scale deployment sources-google-events-router --replicas=1
kubectl scale deployment sources-google-sender --replicas=1
kubectl scale deployment sources-google-webhook --replicas=1
kubectl scale deployment webhook-consumer --replicas=1
kubectl scale deployment webhook-publisher --replicas=1
kubectl scale deployment sources-chatplugin --replicas=1

kubectl delete pod startup-helper --force 2>/dev/null
