#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

sudo yum install -y wget unzip

wget -nv https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm
export PATH=$PATH:/usr/local/bin
mv linux-amd64/helm /usr/local/bin/helm
helm repo add airyhq https://airyhq.github.io/cp-helm-charts/
helm repo update
helm install airy airyhq/cp-helm-charts --version 0.5.0 --timeout 500s

export RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

cd /home/vagrant
kubectl apply -f kafka-client.yaml
sleep 3m

kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp

kubectl exec -it kafka-client -- /tmp/create-topics.sh

kubectl apply -f api-admin.yaml
kubectl apply -f api-communication.yaml
kubectl apply -f events-router.yaml
