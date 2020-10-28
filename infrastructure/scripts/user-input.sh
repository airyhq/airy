#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

cd /vagrant/scripts

mkdir -p ~/airy-core/
cp ../deployments/sources-facebook-events-router.yaml ~/airy-core/	
cp ../deployments/api-admin.yaml ~/airy-core/	
cp ../deployments/api-auth.yaml ~/airy-core/
cp ../deployments/sources-facebook-webhook.yaml ~/airy-core/
cp ../deployments/api-communication.yaml ~/airy-core/

kubectl create configmap secrets-config --from-literal=JWT_SECRET=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 128; echo` --dry-run=client -o yaml | kubectl apply -f -
kubectl create configmap user-config --from-env-file=../airy.conf --dry-run=client -o yaml | kubectl apply -f -

# Generate random string for the ngrok webhook
RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo`
sed -i "s/<ngrok_client_string>/fb-${RANDOM_INGRESS_ID}/" ~/airy-core/sources-facebook-webhook.yaml

kubectl apply -f ~/airy-core/sources-facebook-events-router.yaml
kubectl apply -f ~/airy-core/api-admin.yaml
kubectl apply -f ~/airy-core/api-auth.yaml
kubectl apply -f ~/airy-core/sources-facebook-webhook.yaml
kubectl apply -f ~/airy-core/api-communication.yaml
