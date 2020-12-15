#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

source /vagrant/scripts/lib/k8s.sh

kubectl delete pod startup-helper --force 2>/dev/null || true
kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"

wait-for-ingress-service
wait-for-running-pod startup-helper
wait-for-service startup-helper api-auth 80 10 Airy-auth

FACEBOOK_WEBHOOK_PUBLIC_URL=`kubectl get configmap sources-config -o jsonpath='{.data.FACEBOOK_WEBHOOK_PUBLIC_URL}'`
GOOGLE_WEBHOOK_PUBLIC_URL=`kubectl get configmap sources-config -o jsonpath='{.data.GOOGLE_WEBHOOK_PUBLIC_URL}'`
TWILIO_WEBHOOK_PUBLIC_URL=`kubectl get configmap sources-config -o jsonpath='{.data.TWILIO_WEBHOOK_PUBLIC_URL}'`

echo
echo "Your public url for the Facebook Webhook is:"
echo ${FACEBOOK_WEBHOOK_PUBLIC_URL}/facebook
echo
echo "Your public url for the Google Webhook is:"
echo ${GOOGLE_WEBHOOK_PUBLIC_URL}/google
echo
echo "Your public url for the Twilio Webhook is:"
echo ${TWILIO_WEBHOOK_PUBLIC_URL}/twilio
echo
echo "You can access the API of the Airy Core Platform at:"
echo "http://api.airy/"
echo
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}' http://api.airy/users.signup"

kubectl delete pod startup-helper --force 2>/dev/null
