#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh
APP_IMAGE_TAG=${APP_IMAGE_TAG:-latest}

kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"
cd /vagrant/scripts

kubectl create configmap user-config --from-env-file=../airy.conf --dry-run=client -o yaml | kubectl apply -f -

helm upgrade -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --set global.appImageTag=${APP_IMAGE_TAG} --version 0.5.0 --timeout 1000s > /dev/null 2>&1

kubectl scale deployment airy-cp-schema-registry --replicas=1

wait-for-running-pod startup-helper
wait-for-service startup-helper airy-cp-schema-registry 8081 15 Schema-registry
kubectl delete pod startup-helper --force 2>/dev/null

kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment frontend-demo --replicas=1
kubectl scale deployment frontend-chat-plugin --replicas=1
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
