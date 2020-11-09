#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

RANDOM_POSTGRES_PASSWORD=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 32; echo`
mkdir -p ~/airy-core
cd /vagrant
cp airy.conf.tpl airy.conf
cp -R /vagrant/helm-chart ~/airy-core/
sed -i "s/<pg_password>/$RANDOM_POSTGRES_PASSWORD/" ~/airy-core/helm-chart/charts/postgres/values.yaml

helm install -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --version 0.5.0 --timeout 1000s 2>/dev/null || helm upgrade -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --version 0.5.0 --timeout 1000s 2>/dev/null

export RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

cd /vagrant/scripts/
while ! `kubectl get sa default 2>/dev/null| grep -q default`
do
    echo "Waiting for default ServiceAccount to be created..."
    sleep 5
done
kubectl apply -f ../tools/kafka-client.yaml
kubectl scale statefulset airy-cp-zookeeper --replicas=1

while ! `kubectl get pod --field-selector="metadata.name=kafka-client,status.phase=Running" 2>/dev/null| grep -q kafka-client`
do
    echo "Waiting for kafka-client to start..."
    sleep 10
done

kubectl cp provision/create-topics.sh kafka-client:/tmp
kubectl cp provision/create-database.sh kafka-client:/tmp
kubectl cp /vagrant/scripts/trigger/wait-for-service.sh kafka-client:/root/

kubectl exec kafka-client -- /root/wait-for-service.sh airy-cp-zookeeper 2181 15 Zookeeper
kubectl scale statefulset airy-cp-kafka --replicas=1 
kubectl exec kafka-client -- /root/wait-for-service.sh airy-cp-kafka 9092 15 Kafka
kubectl exec kafka-client -- /tmp/create-topics.sh

kubectl delete pod -l app=postgres
kubectl scale deployment postgres --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh postgres 5432 10 Postgres
kubectl exec kafka-client -- env PGPASSWORD="${RANDOM_POSTGRES_PASSWORD}" /tmp/create-database.sh
kubectl scale statefulset redis-cluster --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh redis-cluster 6379 10 Redis

echo "Deploying ingress controller"
kubectl apply -f ../network/ingress.yaml
