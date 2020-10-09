#!/usr/bin/env bash

sudo yum install -y wget
wget https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm
sudo mv linux-amd64/helm /usr/local/bin/helm
/usr/local/bin/helm repo add airyhq https://airyhq.github.io/cp-helm-charts/
/usr/local/bin/helm repo update
/usr/local/bin/helm install my-confluent airyhq/cp-helm-charts --version 0.5.0 --timeout 500s