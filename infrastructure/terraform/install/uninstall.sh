#! /bin/bash

# Script to provision your kubernetes cluster and install airy

provider="aws-eks"

cd airy-core
terraform destroy -auto-approve

cd ../$provider
terraform destroy