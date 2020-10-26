#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

declare -A config

config=(
    ["FB_APP_ID"]="default"
    ["FB_APP_SECRET"]="default"
    ["FB_WEBHOOK_SECRET"]="default"
)

cd /vagrant/scripts
CONFIG_FILE="../airy.conf"

if test -f "${CONFIG_FILE}"; then
    while read line
    do
        if echo $line | grep -F = &>/dev/null
        then
            varname=$(echo "$line" | cut -d '=' -f 1)
            config[$varname]=$(echo "$line" | cut -d '=' -f 2)
        fi
    done < ${CONFIG_FILE}
fi

mkdir -p ~/airy-core
cp ../deployments/sources-facebook-events-router.yaml ~/airy-core/
cp ../deployments/api-admin.yaml ~/airy-core/
cp ../deployments/sources-facebook-webhook.yaml ~/airy-core/

sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ~/airy-core//sources-facebook-events-router.yaml
sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ~/airy-core//api-admin.yaml

sed -i "s/<fb_app_secret>/${config[FB_APP_SECRET]}/" ~/airy-core/api-admin.yaml

sed -i "s/<fb_webhook_secret>/${config[FB_WEBHOOK_SECRET]}/" ~/airy-core/sources-facebook-webhook.yaml

# Generate random string for the ngrok webhook
RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo`
sed -i "s/<ngrok_client_string>/fb-${RANDOM_INGRESS_ID}/" ~/airy-core/sources-facebook-webhook.yaml

kubectl apply -f ~/airy-core/sources-facebook-events-router.yaml
kubectl apply -f ~/airy-core/api-admin.yaml
kubectl apply -f ~/airy-core/sources-facebook-webhook.yaml
