#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

sudo yum install -y wget unzip nc

wget -nv https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm
export PATH=$PATH:/usr/local/bin

sudo mv linux-amd64/helm /usr/local/bin/helm

RANDOM_POSTGRES_PASSWORD=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 32; echo`
mkdir -p ~/airy-core
cd /vagrant
cp airy.conf.tpl airy.conf
cp -R /vagrant/helm-chart ~/airy-core/
sed -i "s/<pg_password>/$RANDOM_POSTGRES_PASSWORD/" ~/airy-core/helm-chart/charts/postgres/values.yaml

helm install -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --version 0.5.0 --timeout 1000s || helm upgrade -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --version 0.5.0 --timeout 1000s

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis --values helm-chart/charts/redis/values.yaml

export RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

cd /vagrant/scripts/
kubectl apply -f ../tools/kafka-client.yaml
echo "Waiting a few minutes for airy-client, kafka and zookeeper to start in minikube"
while ! `kubectl get pod --field-selector="metadata.name=kafka-client,status.phase=Running" 2>/dev/null| grep -q kafka-client`
do
    sleep 10
    echo "Waiting for kafka-client to start..."
done

kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp
kubectl cp create-database.sh kafka-client:/tmp
kubectl cp /vagrant/scripts/triggers/wait-for-service.sh kafka-client:/root
echo "Creating kafka topics"
kubectl scale statefulset airy-cp-zookeeper --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-cp-zookeeper 2181 15 Zookeeper
kubectl scale statefulset airy-cp-kafka --replicas=1 
kubectl exec kafka-client -- /root/wait-for-service.sh airy-cp-kafka 9092 15 Kafka
kubectl exec kafka-client -- /tmp/create-topics.sh
echo "Creating required databases"
kubectl scale deployment postgres --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh postgres 5432 10 Postgres
kubectl exec kafka-client -- env PGPASSWORD="${RANDOM_POSTGRES_PASSWORD}" /tmp/create-database.sh


echo "Deploying ingress controller"
kubectl apply -f ../network/istio-crd.yaml
kubectl apply -f ../network/istio-controller.yaml
kubectl apply -f ../network/istio-operator.yaml
kubectl label namespace default istio-injection=enabled --overwrite

echo "Deploying ingress routes"
while ! `kubectl get crd 2>/dev/null| grep -q gateways.networking.istio.io`
do
    sleep 15
    echo "Waiting for istio to create all the Gateway CRD..."
done
while ! `kubectl get crd 2>/dev/null| grep -q virtualservices.networking.istio.io`
do
    sleep 15
    echo "Waiting for istio to create all the VirtualService CRD..."
done
kubectl apply -f ../network/istio-services.yaml

sudo yum clean all
