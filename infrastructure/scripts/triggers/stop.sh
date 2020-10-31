#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Scaling down all the apps..."
kubectl scale deployment airy-cp-schema-registry --replicas=0
kubectl scale deployment api-admin --replicas=0
kubectl scale deployment api-auth --replicas=0
kubectl scale deployment api-communication --replicas=0
kubectl scale deployment postgres --replicas=0
kubectl scale deployment sources-facebook-events-router --replicas=0
kubectl scale deployment sources-facebook-sender --replicas=0
kubectl scale deployment sources-facebook-webhook --replicas=0
kubectl scale statefulset redis-cluster --replicas=0
kubectl scale statefulset airy-cp-kafka --replicas=0
kubectl scale statefulset airy-cp-zookeeper --replicas=0
