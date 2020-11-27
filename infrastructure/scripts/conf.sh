#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh
APP_IMAGE_TAG=${AIRY_VERSION:-latest}

kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"
cd /vagrant/scripts

if [ -f "/vagrant/airy.conf" ]; then
    cp /vagrant/airy.conf ~/airy-core/helm-chart/charts/apps/values.yaml
fi

helm upgrade airy ~/airy-core/helm-chart/ --set global.appImageTag=${APP_IMAGE_TAG} --version 0.5.0 --timeout 1000s > /dev/null 2>&1

kubectl scale deployment airy-cp-schema-registry --replicas=1

wait-for-running-pod startup-helper
wait-for-service startup-helper airy-cp-schema-registry 8081 15 Schema-registry
kubectl delete pod startup-helper --force 2>/dev/null

kubectl scale deployment -l airy=api --replicas=1
kubectl scale deployment -l airy=sources --replicas=1
kubectl scale deployment -l airy=webhook --replicas=1
kubectl scale deployment -l airy=frontend --replicas=1
