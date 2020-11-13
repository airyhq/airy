#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

cd /vagrant/scripts
mkdir -p ~/airy-core


kubectl create configmap secrets-config --from-literal=JWT_SECRET=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 128; echo` --dry-run=client -o yaml | kubectl apply -f -
kubectl create configmap user-config --from-env-file=../airy.conf --dry-run=client -o yaml | kubectl apply -f -
kubectl create configmap public-urls --from-literal=RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo` --dry-run=client -o yaml | kubectl apply -f -

helm upgrade -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --set global.appImageTag=beta --version 0.5.0 --timeout 1000s 2>/dev/null

kubectl scale deployment airy-schema-registry --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-schema-registry 8081 15 Schema-registry

kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment frontend-demo --replicas=1
kubectl scale deployment api-communication --replicas=1
kubectl scale deployment sources-facebook-events-router --replicas=1
kubectl scale deployment sources-facebook-sender --replicas=1
kubectl scale deployment sources-facebook-webhook --replicas=1
kubectl scale deployment sources-google-events-router --replicas=1
kubectl scale deployment sources-google-sender --replicas=1
kubectl scale deployment sources-google-webhook --replicas=1
kubectl scale deployment webhook-consumer --replicas=1
kubectl scale deployment webhook-publisher --replicas=1
kubectl scale deployment sources-chatplugin --replicas=1
kubectl scale deployment postgres --replicas=1


/vagrant/scripts/status.sh
