#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh
if [ -z ${AIRY_VERSION+x} ]; then
    branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
    branch_name="(unnamed branch)"     # detached HEAD

    branch_name=${branch_name##refs/heads/}
    case "$branch_name" in
        develop )
            AIRY_VERSION=beta
            ;;
        release* )
            AIRY_VERSION=release
            ;;
        * )
            AIRY_VERSION=latest
            ;;
    esac
fi

kubectl delete pod startup-helper --force 2>/dev/null || true
kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"
cd /vagrant/scripts

if [ -f "/vagrant/airy.conf" ]; then
    cp /vagrant/airy.conf ~/airy-core/helm-chart/charts/apps/values.yaml
fi

helm upgrade airy ~/airy-core/helm-chart/ --set global.appImageTag=${AIRY_VERSION} --version 0.5.0 --timeout 1000s > /dev/null 2>&1

kubectl scale deployment airy-cp-schema-registry --replicas=1

wait-for-running-pod startup-helper
wait-for-service startup-helper airy-cp-schema-registry 8081 15 Schema-registry

kubectl scale deployment -l type=api --replicas=1
kubectl scale deployment -l type=sources-chatplugin --replicas=1
kubectl scale deployment -l type=frontend --replicas=1

wait-for-service startup-helper api-auth 80 10 Airy-auth

kubectl scale deployment -l type=sources-twilio --replicas=1
kubectl scale deployment -l type=sources-google --replicas=1
kubectl scale deployment -l type=sources-facebook --replicas=1
kubectl scale deployment -l type=webhook --replicas=1

kubectl delete pod startup-helper --force 2>/dev/null
