#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Scaling down Airy Core platform applications"
kubectl scale deployment -l airy=api --replicas=0
kubectl scale deployment -l airy=sources --replicas=0
kubectl scale deployment -l airy=webhook --replicas=0
kubectl scale deployment -l airy=frontend --replicas=0
kubectl scale deployment airy-cp-schema-registry --replicas=0
kubectl scale statefulset airy-cp-kafka --replicas=0
kubectl scale statefulset airy-cp-zookeeper --replicas=0
kubectl scale deployment postgres --replicas=0
kubectl scale statefulset redis-cluster --replicas=0
