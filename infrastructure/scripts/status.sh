#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl -n istio-system get service --field-selector="metadata.name=istio-ingressgateway" 2>/dev/null | grep -q "istio-ingressgateway"`
do
    sleep 5
    echo "Waiting for ingressgateway to start... "
done

kubectl exec kafka-client -- /root/wait-for-service.sh api-auth 80 10 Airy-auth

INGRESS_PORT=`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}'`
INGRESS_IP=`ip addr show eth1 | grep "inet " | awk '{ print $2; }' | cut -d "/" -f1`

while ! nc -z ${INGRESS_IP} ${INGRESS_PORT}
do
    echo "Waiting for ingress port to open..."
    sleep 15
    INGRESS_PORT=`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}'`
done

FB_WEBHOOK_PUBLIC_URL=`kubectl get configmap public-urls -o jsonpath='{.data.FB_WEBHOOK_PUBLIC_URL}'`

echo
echo "Your public url for the Facebook Webhook is:"
echo ${FB_WEBHOOK_PUBLIC_URL}
echo
echo "You can access the API of the Airy Core Platform at:"
echo "http://${INGRESS_IP}:${INGRESS_PORT}/facebook"
echo
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}' http://${INGRESS_IP}:${INGRESS_PORT}/users.signup"
