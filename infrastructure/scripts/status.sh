#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
INFRASTRUCTURE_PATH=$(cd "${SCRIPT_PATH}"/../; pwd -P)

# shellcheck source=/dev/null
source "${INFRASTRUCTURE_PATH}/scripts/lib/k8s.sh"

kubectl delete pod startup-helper --force 2>/dev/null || true
kubectl run startup-helper --image busybox --command -- /bin/sh -c "tail -f /dev/null"

wait-for-ingress-service
wait-for-running-pod startup-helper
wait-for-service startup-helper api-auth 80 10 api-auth

CORE_ID=$(kubectl get configmap core-config -o jsonpath='{.data.CORE_ID}')
API_HOSTNAME=$(kubectl get ingress airy-core -o jsonpath='{.spec.rules[0].host}')
NGROK_ENABLED=$(kubectl get configmap core-config -o jsonpath='{.data.NGROK_ENABLED}')

if [ "${NGROK_ENABLED}" = "true" ]; then
    FACEBOOK_WEBHOOK_PUBLIC_URL="https://fb-${CORE_ID}.tunnel.airy.co/facebook"
    GOOGLE_WEBHOOK_PUBLIC_URL="https://gl-${CORE_ID}.tunnel.airy.co/google"
    TWILIO_WEBHOOK_PUBLIC_URL="https://tw-${CORE_ID}.tunnel.airy.co/twilio"
else
    WEBHOOKS_HOSTNAME=$(kubectl get configmap hostnames -o jsonpath='{.data.WEBHOOKS_HOST}')
    FACEBOOK_WEBHOOK_PUBLIC_URL="https://${WEBHOOKS_HOSTNAME}/facebook"
    GOOGLE_WEBHOOK_PUBLIC_URL="https://${WEBHOOKS_HOSTNAME}/google"
    TWILIO_WEBHOOK_PUBLIC_URL="https://${WEBHOOKS_HOSTNAME}/twilio"
fi

echo
echo "Your public url for the Facebook Webhook is:"
echo "${FACEBOOK_WEBHOOK_PUBLIC_URL}"
echo
echo "Your public url for the Google Webhook is:"
echo "${GOOGLE_WEBHOOK_PUBLIC_URL}"
echo
echo "Your public url for the Twilio Webhook is:"
echo "${TWILIO_WEBHOOK_PUBLIC_URL}"
echo
echo "You can access the Airy Core HTTP API at:"
echo "http://${API_HOSTNAME}"
echo
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}' http://${API_HOSTNAME}/users.signup"

kubectl delete pod startup-helper --force 2>/dev/null
