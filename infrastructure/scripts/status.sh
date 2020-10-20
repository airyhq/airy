#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! `kubectl -n istio-system get service --field-selector="metadata.name=istio-ingressgateway" 2>/dev/null | grep -q "istio-ingressgateway"`
do 
    sleep 5
    echo "Waiting for ingressgateway to start... "
done

INGRESS_PORT=`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}'`
INGRESS_IP=`ip addr show eth1 | grep "inet " | awk '{ print $2; }' | cut -d "/" -f1`
echo $INGRESS_IP:$INGRESS_PORT
echo "You can access the API of Airy Core at:"
echo "http://$INGRESS_IP:$INGRESS_PORT/"
echo 
echo "Example:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{"first_name": "Grace","last_name": "Hopper","password": "the_answer_is_42","email": "grace@example.com"}' http://$INGRESS_IP:$INGRESS_PORT/users.signup"
