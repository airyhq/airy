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

cd /vagrant
pwd
ls -lah

helm install airy airyhq/cp-helm-charts --version 0.5.0 --timeout 500s

export RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

cd /vagrant/scripts/
kubectl apply -f ../tools/kafka-client.yaml
pwd
ls -a
sleep 3m
echo "Copying scripts now..."
kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp
echo "Creating topics now..."
kubectl exec -it kafka-client -- /tmp/create-topics.sh
echo "Creating airy deployments..."
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/api-communication.yaml
kubectl apply -f ../deployments/events-router.yaml
