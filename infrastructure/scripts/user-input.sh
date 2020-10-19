#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo Please enter your Facebook app id
read fb_app_id

sed -i '.bak' "s/<fb_app_id>/$fb_app_id/" ../deployments/sources-facebook-events-router.yaml
sed -i '.bak' "s/<fb_app_id>/$fb_app_id/" ../deployments/api-admin.yaml

echo Please enter your Facebook app secret
read fb_app_secret


sed -i  '.bak' "s/<fb_app_secret>/$fb_app_secret/" ../deployments/api-admin.yaml

echo Please enter your Facebook webhook secret
read fb_webhook_secret

sed -i '.bak' "s/<fb_webhook_secret>/$fb_webhook_secret/" ../deployments/sources-facebook-webhook.yaml

kubectl apply -f ../deployments/sources-facebook-events-router.yaml
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/sources-facebook-webhook.yaml