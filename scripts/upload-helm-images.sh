#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

bucket_name="airy-core-helm-charts"
version=$(cat ./VERSION)

case ${GITHUB_BRANCH} in
refs/heads/develop)
    s3_basepath=s3://$bucket_name/develop
    ;;
refs/heads/release*)
    s3_basepath=s3://$bucket_name/$version-rc
    ;;
refs/heads/main)
    s3_basepath=s3://$bucket_name/$version
    aws s3 cp ../VERSION s3://$bucket_name/stable.txt
    ;;
*)
    exit 0
    ;;
esac

sudo snap install helm --classic

mkdir helm-repo
cd helm-repo
helm package ../infrastructure/helm-chart/
helm package ../infrastructure/helm-chart/charts/prerequisites/charts/kafka
helm package ../infrastructure/helm-chart/charts/prerequisites/charts/beanstalkd/
helm package ../infrastructure/helm-chart/charts/core/
helm package ../infrastructure/helm-chart/charts/tools/charts/akhq/
helm repo index .

find . -type f -name "*.tgz" -exec aws s3 cp "{}" "${s3_basepath}/" \;
aws s3 cp index.yaml  "${s3_basepath}/"
