#!/bin/bash
#set -euo pipefail
#IFS=$'\n\t'

config=( # set default values in config array
    [FB_APP_ID]="default"
    [FB_APP_SECRET]="default"
    [FB_WEBHOOK_SECRET]="default"
)

cd /vagrant/scripts

while read line
do
    if echo $line | grep -F = &>/dev/null
    then
        varname=$(echo "$line" | cut -d '=' -f 1)
        config[$varname]=$(echo "$line" | cut -d '=' -f 2-)
    fi
done < ../airy.conf

sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ../deployments/sources-facebook-events-router.yaml
sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ../deployments/api-admin.yaml

sed -i "s/<fb_app_secret>/${config[FB_APP_SECRET]}/" ../deployments/api-admin.yaml

sed -i "s/<fb_webhook_secret>/${config[FB_WEBHOOK_SECRET]}/" ../deployments/sources-facebook-webhook.yaml

# Generate random string for the ngrok webhook
RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo`
sed -i "s/<ngrok_client_string>/${RANDOM_INGRESS_ID}/" ../deployments/sources-facebook-webhook.yaml

kubectl apply -f ../deployments/sources-facebook-events-router.yaml
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/sources-facebook-webhook.yaml
