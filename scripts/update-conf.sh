#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

infra_path=""
infra_path+=$( dirname $SCRIPT_PATH )
infra_path+="/infrastructure"

cd $infra_path
vagrant ssh -c "sudo /vagrant/scripts/conf.sh"
