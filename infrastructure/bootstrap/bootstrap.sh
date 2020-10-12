#!/usr/bin/env bash

sudo yum install -y wget unzip
sudo yum install git cmake gcc-c++ cyrus-sasl -y 
sudo yum install -y librdkafka-devel yajl-devel avro-c-devel

sudo yum group install “Development Tools” -y
git clone https://github.com/edenhill/kafkacat.git
cd kafkacat/
./configure
make
cd


#Helm install Airy chart
wget -nv https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm
export PATH=$PATH:/usr/local/bin
mv linux-amd64/helm /usr/local/bin/helm
helm repo add airyhq https://airyhq.github.io/cp-helm-charts/
helm repo update
helm install airy airyhq/cp-helm-charts --version 0.5.0 --timeout 500s

# Terraform
wget -nv https://releases.hashicorp.com/terraform/0.12.2/terraform_0.12.2_linux_amd64.zip
unzip -u ./terraform_0.12.2_linux_amd64.zip -d /usr/local/bin/

# Terraform Kafka Providerexport RELEASE_NAME=airy
export ZOOKEEPERS=${RELEASE_NAME}-cp-zookeeper:2181
export KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092

# mkdir -p terraform/.terraform/plugins/linux_amd64
# wget -nv https://github.com/Mongey/terraform-provider-kafka/releases/download/v0.2.10/terraform-provider-kafka_0.2.10_linux_amd64.zip
# unzip -u terraform-provider-kafka_0.2.10_linux_amd64.zip && sudo mv terraform-provider-kafka_v0.2.10 terraform/.terraform/plugins/linux_amd64

# cd terraform
# terraform init

# Create Kafka topics
# terraform apply -y
cd /home/vagrant

kubectl apply -f kafka-client.yaml
kubectl cp topics.sh kafka-client:/tmp
kubectl cp create-topics.sh kafka-client:/tmp
kubectl apply -f deployment.yaml

kubectl exec -it kafka-client -- /tmp/create-topics.sh


