#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

sudo yum install -y wget unzip

wget -nv https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm
export PATH=$PATH:/usr/local/bin
sudo mv linux-amd64/helm /usr/local/bin/helm
helm repo add airyhq https://airyhq.github.io/cp-helm-charts/
helm repo update

helm install airy airyhq/cp-helm-charts --version 0.5.0 --timeout 500s

export RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

cd /vagrant/scripts/
kubectl apply -f ../tools/kafka-client.yaml
echo "Waiting few minutes for airy-client, kafka and zookeeper to start in minikube"
while ! `kubectl get pod --field-selector="metadata.name=kafka-client,status.phase=Running" 2>/dev/null| grep -q kafka-client`
do 
    sleep 10
    echo "Waiting for kafka-client to start..."
done

echo "Creating kafka topics and required databaes"
kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp
kubectl cp create-database.sh kafka-client:/tmp
kubectl exec -it kafka-client -- /tmp/create-topics.sh
kubectl exec -it kafka-client -- /tmp/create-database.sh

echo "Deploying ingress controller"
kubectl apply -f ../network/istio-crd.yaml
kubectl apply -f ../network/istio-controller.yaml
kubectl apply -f ../network/istio-operator.yaml
kubectl label namespace default istio-injection=enabled

echo "Deploying airy-core apps"
kubectl apply -f ../deployments/api-auth.yaml
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/api-communication.yaml
kubectl apply -f ../deployments/sources-facebook-events-router.yaml
kubectl apply -f ../deployments/sources-facebook-sender.yaml
kubectl apply -f ../deployments/sources-facebook-webhook.yaml

echo "Deploying ingress routes"
while ! `kubectl get crd 2>/dev/null| grep -q gateways.networking.istio.io`
do 
    sleep 5
    echo "Waiting for istio to create all the Gateway CRD..."
done
while ! `kubectl get crd 2>/dev/null| grep -q virtualservices.networking.istio.io`
do 
    sleep 5
    echo "Waiting for istio to create all the VirtualService CRD..."
done
kubectl apply -f ../network/istio-services.yaml
