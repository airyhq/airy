#! /bin/bash

# Script to provision your kubernetes cluster and install airy
provider='aws-eks'

cd $provider
terraform init
terraform apply -auto-approve

cd ../airy-core
terraform init
terraform apply -auto-approve