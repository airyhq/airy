#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl get pod --field-selector="metadata.name=kafka-client,status.phase=Running" 2>/dev/null| grep -q kafka-client`
do
    sleep 10
    echo "Waiting for kafka-client to start..."
done

kubectl cp /vagrant/scripts/triggers/wait-for-service.sh kafka-client:/root
kubectl scale statefulset airy-cp-zookeeper --replicas=1
kubectl exec -it kafka-client -- /root/wait-for-service.sh airy-cp-zookeeper 2181 10 Zookeeper 1>/dev/null
kubectl scale statefulset airy-cp-kafka --replicas=1 
kubectl exec -it kafka-client -- /root/wait-for-service.sh airy-cp-kafka 9092 10 Kafka 1>/dev/null
kubectl scale statefulset redis-cluster --replicas=1
kubectl exec -it kafka-client -- /root/wait-for-service.sh redis-cluster 6379 5 Redis 1>/dev/null
kubectl scale deployment postgres --replicas=1
kubectl exec -it kafka-client -- /root/wait-for-service.sh postgres 5432 5 Postgres 1>/dev/null
kubectl scale deployment airy-cp-schema-registry --replicas=1
kubectl exec -it kafka-client -- /root/wait-for-service.sh airy-cp-schema-registry 8081 5 Postgres 1>/dev/null
echo "Starting up all the apps"
kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment api-communication --replicas=1
kubectl scale deployment sources-facebook-events-router --replicas=1
kubectl scale deployment sources-facebook-sender --replicas=1
kubectl scale deployment sources-facebook-webhook --replicas=1
