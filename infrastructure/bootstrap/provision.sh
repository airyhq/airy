#!/bin/bash

sudo yum install -y wget unzip
sudo yum install git cmake gcc-c++ cyrus-sasl -y 
sudo yum install -y librdkafka-devel yajl-devel avro-c-devel

sudo yum group install “Development Tools” -y
git clone https://github.com/edenhill/kafkacat.git
cd kafkacat/
./configure
make
cd

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
sleep 3m

kubectl apply -f kafka-client.yaml
kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp

kubectl exec -it kafka-client -- /tmp/create-topics.sh

kubectl apply -f api-admin.yaml
kubectl apply -f api-communication.yaml
kubectl apply -f events-router.yaml
