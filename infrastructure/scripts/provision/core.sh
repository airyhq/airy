#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh
APP_IMAGE_TAG="${AIRY_VERSION:-latest}"

mkdir -p ~/airy-core
cd /vagrant
cp -u airy.conf.tpl airy.conf
cp -R /vagrant/helm-chart ~/airy-core/

# Generate random NGrok ID
RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo`
sed -i "s/<ngrok_client_id>/${RANDOM_INGRESS_ID}/" ~/airy-core/helm-chart/charts/apps/charts/airy-config/values.yaml
# Generate random Postgress password
RANDOM_POSTGRES_PASSWORD=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 32; echo`
sed -i "s/<pg_password>/$RANDOM_POSTGRES_PASSWORD/" ~/airy-core/helm-chart/charts/postgres/values.yaml
sed -i "s/<pg_password>/$RANDOM_POSTGRES_PASSWORD/" ~/airy-core/helm-chart/charts/apps/charts/airy-config/values.yaml
# Generate random JWT secret token
RANDOM_JWT_SECRET=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 128; echo`
sed -i "s/<jwt_secret>/$RANDOM_JWT_SECRET/" ~/airy-core/helm-chart/charts/apps/charts/airy-config/values.yaml

echo "Deploying the Airy Core Platform with the ${APP_IMAGE_TAG} image tag"

cd /vagrant/scripts/
wait-for-service-account

helm install airy ~/airy-core/helm-chart/ --set global.appImageTag=${APP_IMAGE_TAG} --version 0.5.0 --timeout 1000s > /dev/null 2>&1

kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"
kubectl scale statefulset airy-cp-zookeeper --replicas=1

wait-for-running-pod startup-helper
wait-for-service startup-helper airy-cp-zookeeper 2181 15 Zookeeper
kubectl scale statefulset airy-cp-kafka --replicas=1
wait-for-service startup-helper airy-cp-kafka 9092 15 Kafka
kubectl cp provision/create-topics.sh airy-cp-kafka-0:/tmp
kubectl exec airy-cp-kafka-0 -- /tmp/create-topics.sh

kubectl scale deployment postgres --replicas=1
wait-for-service startup-helper postgres 5432 10 Postgres

kubectl scale statefulset redis-cluster --replicas=1
wait-for-service startup-helper redis-cluster 6379 10 Redis
kubectl delete pod startup-helper --force 2>/dev/null

echo "Deploying ingress controller"
kubectl apply -f ../network/ingress.yaml
