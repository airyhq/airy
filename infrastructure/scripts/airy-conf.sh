#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

declare -A config

config=(
    ["FB_APP_ID"]="default"
    ["FB_APP_SECRET"]="default"
    ["FB_WEBHOOK_SECRET"]="default"
    ["GOOGLE_PARTNER_KEY"]="default"
    ["GOOGLE_SA_FILE"]="default"
    ["MAIL_URL"]="default"
    ["MAIL_PORT"]="587"
    ["MAIL_USERNAME"]="default"
    ["MAIL_PASSWORD"]="default"
    ["MAIL_FROM"]="default@localhost"
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
cp ../deployments/* ~/airy-core/

RANDOM_POSTGRES_PASSWORD=`kubectl get configmap postgres-config -o jsonpath='{.data.POSTGRES_PASSWORD}'`
sed -i "s/<pg_password>/${RANDOM_POSTGRES_PASSWORD}/" ~/airy-core/api-auth.yaml

RANDOM_JWT_SECRET=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 128; echo`
sed -i "s/<jwt_secret>/${RANDOM_JWT_SECRET}/" ~/airy-core/api-auth.yaml
sed -i "s/<jwt_secret>/${RANDOM_JWT_SECRET}/" ~/airy-core/api-admin.yaml
sed -i "s/<jwt_secret>/${RANDOM_JWT_SECRET}/" ~/airy-core/api-communication.yaml
sed -i "s/<jwt_secret>/${RANDOM_JWT_SECRET}/" ~/airy-core/sources-chatplugin.yaml

sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ~/airy-core/sources-facebook-events-router.yaml
sed -i "s/<fb_app_id>/${config[FB_APP_ID]}/" ~/airy-core/api-admin.yaml

sed -i "s/<fb_app_secret>/${config[FB_APP_SECRET]}/" ~/airy-core/api-admin.yaml

sed -i "s/<fb_webhook_secret>/${config[FB_WEBHOOK_SECRET]}/" ~/airy-core/sources-facebook-webhook.yaml

sed -i "s/<google_partner_key>/${config[GOOGLE_PARTNER_KEY]}/" ~/airy-core/sources-google-webhook.yaml
sed -i "s/<google_sa_file>/${config[GOOGLE_SA_FILE]}/" ~/airy-core/sources-google-sender.yaml

sed -i "s/<mail_url>/${config[MAIL_URL]}/" ~/airy-core/api-auth.yaml
sed -i "s/<mail_port>/${config[MAIL_PORT]}/" ~/airy-core/api-auth.yaml
sed -i "s/<mail_username>/${config[MAIL_USERNAME]}/" ~/airy-core/api-auth.yaml
sed -i "s/<mail_password>/${config[MAIL_PASSWORD]}/" ~/airy-core/api-auth.yaml
sed -i "s/<mail_from>/${config[MAIL_FROM]}/" ~/airy-core/api-auth.yaml

# Generate random string for the ngrok webhook
RANDOM_INGRESS_ID=`cat /dev/urandom | env LC_CTYPE=C tr -dc a-z0-9 | head -c 16; echo`
sed -i "s/<ngrok_client_id>/${RANDOM_INGRESS_ID}/" ~/airy-core/public-urls-config.yaml

kubectl apply -f ~/airy-core/api-admin.yaml
kubectl apply -f ~/airy-core/api-auth.yaml
kubectl apply -f ~/airy-core/frontend-demo.yaml
kubectl apply -f ~/airy-core/api-communication.yaml
kubectl apply -f ~/airy-core/sources-facebook-events-router.yaml
kubectl apply -f ~/airy-core/sources-facebook-sender.yaml
kubectl apply -f ~/airy-core/sources-facebook-webhook.yaml
kubectl apply -f ~/airy-core/sources-google-events-router.yaml
kubectl apply -f ~/airy-core/sources-google-sender.yaml
kubectl apply -f ~/airy-core/sources-google-webhook.yaml
kubectl apply -f ~/airy-core/webhook-consumer.yaml
kubectl apply -f ~/airy-core/webhook-publisher.yaml
kubectl apply -f ~/airy-core/sources-chatplugin.yaml

kubectl scale deployment airy-cp-schema-registry --replicas=1
kubectl exec kafka-client -- /root/wait-for-service.sh airy-cp-schema-registry 8081 15 Schema-registry

kubectl scale deployment api-admin --replicas=1
kubectl scale deployment api-auth --replicas=1
kubectl scale deployment frontend-demo --replicas=1
kubectl scale deployment api-communication --replicas=1
kubectl scale deployment sources-facebook-events-router --replicas=1
kubectl scale deployment sources-facebook-sender --replicas=1
kubectl scale deployment sources-facebook-webhook --replicas=1
kubectl scale deployment sources-google-events-router --replicas=1
kubectl scale deployment sources-google-sender --replicas=1
kubectl scale deployment sources-google-webhook --replicas=1
kubectl scale deployment webhook-consumer --replicas=1
kubectl scale deployment webhook-publisher --replicas=1
kubectl scale deployment sources-chatplugin --replicas=1

/vagrant/scripts/status.sh
