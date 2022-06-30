#!/bin/bash

if [ ${AWS_PROFILE+x} ]; then 
    export TF_VAR_aws_profile=${AWS_PROFILE}
fi

if [ ${AWS_REGION+x} ]; then 
    export TF_VAR_aws_region=${AWS_REGION}
fi
