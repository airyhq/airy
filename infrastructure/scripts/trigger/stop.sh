#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Scaling down Airy Core components"
kubectl scale deployment -l app=airy-controller --replicas=0
kubectl scale deployment -l type=frontend --replicas=0
kubectl scale deployment -l type=sources-twilio --replicas=0
kubectl scale deployment -l type=sources-google --replicas=0
kubectl scale deployment -l type=sources-facebook --replicas=0
kubectl scale deployment -l type=sources-chatplugin --replicas=0
kubectl scale deployment -l type=webhook --replicas=0
kubectl scale deployment -l type=media --replicas=0
kubectl scale deployment -l type=sources-chatplugin --replicas=0
kubectl scale deployment -l type=api --replicas=0
kubectl scale deployment schema-registry --replicas=0
kubectl scale statefulset kafka --replicas=0
kubectl scale statefulset zookeeper --replicas=0
kubectl scale deployment postgres --replicas=0
kubectl scale statefulset redis-cluster --replicas=0
