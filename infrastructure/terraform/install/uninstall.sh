#! /bin/bash
set -eo pipefail
IFS=$'\n\t'

source ./install.flags

if [ -z ${PROVIDER+x} ]; then
  echo "PROVIDER is not set. Exiting."
  exit 1
fi

if [ -f ${PROVIDER}/variables.sh ]; then
    source ${PROVIDER}/variables.sh
fi

read -p "Uninstall airy-core from provider ${PROVIDER} [y/n]?" -n 1 -r
echo
if [[ ! ${REPLY} =~ ^[yY]$ ]]; then
  echo "Uninstallation aborted"
  exit 1
fi

cd "airy-core" 2>/dev/null ||  ( echo "Terraform directory \"airy-core\" doesn't exist"; exit 1)
terraform destroy -auto-approve

cd "../${PROVIDER}" 2>/dev/null || ( echo "Terraform directory ${PROVIDER} doesn't exist"; exit 1)
terraform destroy -auto-approve
