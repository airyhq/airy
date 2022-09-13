#! /bin/bash
set -eo pipefail
IFS=$'\n\t'

# shellcheck source=/dev/null
source "./install.flags"

if [ -z ${PROVIDER+x} ]; then
  echo "PROVIDER is not set. Exiting."
  exit 1
fi

if [ -z ${WORKSPACE+x} ]; then
  echo "WORKSPACE is not set. Exiting."
  exit 1
fi

if [ -f "${PROVIDER}"/variables.sh ]; then
    # shellcheck source=/dev/null
    source "${PROVIDER}"/variables.sh
fi

if [ ! -f "${WORKSPACE}"/airy.yaml ]; then
    touch "${WORKSPACE}"/airy.yaml
fi

read -p "Install airy-core on provider ${PROVIDER} [y/n]?" -n 1 -r
echo
if [[ ! ${REPLY} =~ ^[yY]$ ]]; then
  echo "Installation aborted"
  exit 1
fi

cd "${PROVIDER}" 2>/dev/null || ( echo "Terraform directory ${PROVIDER} doesn't exist"; exit 1)
terraform init
terraform apply -auto-approve

cd "../airy-core" 2>/dev/null ||  ( echo "Terraform directory \"airy-core\" doesn't exist"; exit 1)
terraform init
terraform apply -auto-approve
