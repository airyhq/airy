#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Scaling down Airy Core platform applications"
kubectl scale deployment -l type=frontend --replicas=0
kubectl scale deployment -l type=sources-twilio --replicas=0
kubectl scale deployment -l type=sources-google --replicas=0
kubectl scale deployment -l type=sources-facebook --replicas=0
kubectl scale deployment -l type=sources-chatplugin --replicas=0
kubectl scale deployment -l type=webhook --replicas=0
kubectl scale deployment -l type=sources-chatplugin --replicas=0
kubectl scale deployment -l type=api --replicas=0
kubectl scale deployment airy-cp-schema-registry --replicas=0
kubectl scale statefulset airy-cp-kafka --replicas=0
kubectl scale statefulset airy-cp-zookeeper --replicas=0
kubectl scale deployment postgres --replicas=0
kubectl scale statefulset redis-cluster --replicas=0
