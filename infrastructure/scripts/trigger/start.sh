#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh

kubectl delete pod startup-helper --force 2>/dev/null || true
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
kubectl scale deployment -l type=api --replicas=1
kubectl scale deployment -l type=sources-chatplugin --replicas=1
kubectl scale deployment -l type=frontend --replicas=1

wait-for-service startup-helper api-auth 80 10 Airy-auth

kubectl scale deployment -l type=sources-twilio --replicas=1
kubectl scale deployment -l type=sources-google --replicas=1
kubectl scale deployment -l type=sources-facebook --replicas=1
kubectl scale deployment -l type=webhook --replicas=1

kubectl delete pod startup-helper --force 2>/dev/null
chmod o+r /etc/rancher/k3s/k3s.yaml
