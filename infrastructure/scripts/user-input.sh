#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

config=( # set default values in config array
    [fb_app_id]="default"
    [fb_app_secret]="default"
    [fb_webhook_secret]="default"
)

while read line
do
    if echo $line | grep -F = &>/dev/null
    then
        varname=$(echo "$line" | cut -d '=' -f 1)
        config[$varname]=$(echo "$line" | cut -d '=' -f 2-)
    fi
done < ../airy.conf

sed -i '.bak' "s/<fb_app_id>/${config[fb_app_id]}/" ../deployments/sources-facebook-events-router.yaml
sed -i '.bak' "s/<fb_app_id>/${config[fb_app_id]}/" ../deployments/api-admin.yaml

sed -i  '.bak' "s/<fb_app_secret>/${config[fb_app_se]}cret/" ../deployments/api-admin.yaml

sed -i '.bak' "s/<fb_webhook_secret>/${config[fb_webhoo]}k_secret/" ../deployments/sources-facebook-webhook.yaml

kubectl apply -f ../deployments/sources-facebook-events-router.yaml
kubectl apply -f ../deployments/api-admin.yaml
kubectl apply -f ../deployments/sources-facebook-webhook.yaml