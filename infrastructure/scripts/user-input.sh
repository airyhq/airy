#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

config=( # set default values in config array
    [FB_APP_ID]="default"
    [FB_APP_SECRET]="default"
    [FB_WEBHOOK_SECRET]="default"
)

while read line
do
    if echo $line | grep -F = &>/dev/null
    then
        varname=$(echo "$line" | cut -d '=' -f 1)
        config[$varname]=$(echo "$line" | cut -d '=' -f 2-)
    fi
done < ../airy.conf

sed -i '.bak' "s/<fb_app_id>/${config[FB_APP_ID]}/" ../deployments/sources-facebook-events-router.yaml
sed -i '.bak' "s/<fb_app_id>/${config[FB_APP_ID]}/" ../deployments/api-admin.yaml

sed -i  '.bak' "s/<fb_app_secret>/${config[FB_APP_SECRET]}cret/" ../deployments/api-admin.yaml

sed -i '.bak' "s/<fb_webhook_secret>/${config[FB_WEBHOOK_SECRET]}k_secret/" ../deployments/sources-facebook-webhook.yaml

kubectl apply -f ../deployments/sources-facebook-events-router.yaml
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/sources-facebook-webhook.yaml