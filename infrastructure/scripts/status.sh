#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl -n kube-system get service --field-selector="metadata.name=traefik" 2>/dev/null | grep -q "traefik"`
do
    echo "Waiting for ingress to start... "
    sleep 10
done

kubectl exec kafka-client -- /root/wait-for-service.sh api-auth 80 10 Airy-auth


FACEBOOK_WEBHOOK_PUBLIC_URL=`kubectl get configmap public-urls -o jsonpath='{.data.FACEBOOK_WEBHOOK_PUBLIC_URL}'`
GOOGLE_WEBHOOK_PUBLIC_URL=`kubectl get configmap public-urls -o jsonpath='{.data.GOOGLE_WEBHOOK_PUBLIC_URL}'`

echo
echo "Your public url for the Facebook Webhook is:"
echo ${FACEBOOK_WEBHOOK_PUBLIC_URL}/facebook
echo
echo "Your public url for the Google Webhook is:"
echo ${GOOGLE_WEBHOOK_PUBLIC_URL}/google
echo
echo "You can access the API of the Airy Core Platform at:"
echo "http://api.airy/"
echo
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}' http://api.airy/users.signup"
