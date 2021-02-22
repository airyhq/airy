#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
INFRASTRUCTURE_PATH=$(cd "${SCRIPT_PATH}"/../../; pwd -P)

# shellcheck source=/dev/null
source "${INFRASTRUCTURE_PATH}"/scripts/lib/k8s.sh


cd "${INFRASTRUCTURE_PATH}"/scripts/
wait-for-service-account

echo "Deploying Airy Core with the ${AIRY_VERSION} image tag"

if [[ -f "${INFRASTRUCTURE_PATH}"/airy.yaml ]]; then
    yq eval '.global.appImageTag="'"${AIRY_VERSION}"'"' -i "${INFRASTRUCTURE_PATH}"/airy.yaml
    helm install core "${INFRASTRUCTURE_PATH}"/helm-chart/ --values "${INFRASTRUCTURE_PATH}"/airy.yaml --set global.ngrokEnabled="${NGROK_ENABLED}" --timeout 1000s > /dev/null 2>&1
    wget -qnv https://airy-core-binaries.s3.amazonaws.com/"${AIRY_VERSION}"/linux/amd64/airy
    chmod +x airy
    mv airy /usr/local/bin/
    airy init
    airy config apply --kube-config /etc/rancher/k3s/k3s.yaml --config "${INFRASTRUCTURE_PATH}"/airy.yaml
else
    helm install core "${INFRASTRUCTURE_PATH}"/helm-chart/ --set global.appImageTag="${AIRY_VERSION}" --set global.ngrokEnabled="${NGROK_ENABLED}" --timeout 1000s > /dev/null 2>&1
fi
