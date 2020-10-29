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

cp -R /vagrant/helm-chart ~/airy-core/
RANDOM_POSTGRES_PASSWORD=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 32; echo`
sed "s/<pg_password>/$RANDOM_POSTGRES_PASSWORD/" /vagrant/helm-chart/charts/postgres/values.yaml > ~/airy-core/helm-chart/charts/postgres/values.yaml	
/usr/local/bin/helm upgrade -f ~/airy-core/helm-chart/values.yaml airy ~/airy-core/helm-chart/ --version 0.5.0 --timeout 1000s	
kubectl delete pods -l app=postgres	
kubectl create configmap postgres-config --from-literal=POSTGRES_PASSWORD=$RANDOM_POSTGRES_PASSWORD --from-literal=POSTGRES_USER=postgresadmin --dry-run=client -o yaml | kubectl apply -f -

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
