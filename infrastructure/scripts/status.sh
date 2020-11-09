#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl -n kube-system get service --field-selector="metadata.name=traefik" 2>/dev/null | grep -q "traefik"`
do
    echo "Waiting for ingress to start... "
    sleep 10
done

kubectl exec kafka-client -- /root/wait-for-service.sh api-auth 80 10 Airy-auth

INGRESS_IP=`ip addr show eth1 | grep "inet " | awk '{ print $2; }' | cut -d "/" -f1`

FB_WEBHOOK_PUBLIC_URL=`kubectl get configmap public-urls -o jsonpath='{.data.FB_WEBHOOK_PUBLIC_URL}'`

echo
echo "Your public url for the Facebook Webhook is:"
echo ${FB_WEBHOOK_PUBLIC_URL}/facebook
echo
echo "You can access the API of the Airy Core Platform at:"
echo "http://${INGRESS_IP}/"
echo
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}' http://${INGRESS_IP}/users.signup"
