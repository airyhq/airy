#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl get pod --field-selector="metadata.name=kafka-client,status.phase=Running" 2>/dev/null| grep -q kafka-client`
do
    sleep 5
    echo "Waiting for kafka-client to start..."
done

while ! `kubectl exec kafka-client -- id > /dev/null`
do
    sleep 5
    echo "Waiting for kafka-client to be ready..."
done

kubectl cp /vagrant/scripts/trigger/wait-for-service.sh kafka-client:/root/
kubectl scale statefulset airy-zookeeper --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-zookeeper 2181 15 Zookeeper
kubectl scale statefulset airy-kafka --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-kafka 9092 15 Kafka
kubectl scale statefulset redis-cluster --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh redis-cluster 6379 10 Redis
kubectl scale deployment postgres --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh postgres 5432 10 Postgres
kubectl scale deployment airy-schema-registry --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-schema-registry 8081 15 Schema-registry

echo "Starting up Airy Core Platform appplications"
kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment frontend-demo --replicas=1
kubectl scale deployment api-communication --replicas=1
kubectl scale deployment sources-facebook-events-router --replicas=1
kubectl scale deployment sources-facebook-sender --replicas=1
kubectl scale deployment sources-facebook-webhook --replicas=1
kubectl scale deployment webhook-consumer --replicas=1
kubectl scale deployment webhook-publisher --replicas=1
kubectl scale deployment sources-chatplugin --replicas=1


chmod o+r /etc/rancher/k3s/k3s.yaml
