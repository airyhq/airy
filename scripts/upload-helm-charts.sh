#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

bucket_name="airy-core-helm-charts"
version=$(cat ./VERSION)

case ${GITHUB_BRANCH} in
refs/heads/develop)
    s3_basepath=s3://${bucket_name}/stable
    ;;
refs/heads/release*)
    s3_basepath=s3://${bucket_name}/stable
    ;;
refs/heads/main)
    s3_basepath=s3://${bucket_name}/stable
    ;;
*)
    exit 0
    ;;
esac

sudo snap install helm --classic
helm plugin install https://github.com/hypnoglow/helm-s3.git

helm repo add airy ${s3_basepath}
mkdir helm-repo
cd helm-repo
cp -a ../infrastructure/helm-chart ./
find ./helm-chart/ -iname Chart.yaml -exec sed -i "s/0-develop/${version}/g" {} \;
helm package ./helm-chart/ --version "${version}"
helm package ./helm-chart/charts/prerequisites/charts/kafka/
helm package ./helm-chart/charts/prerequisites/charts/beanstalkd/
helm package ./helm-chart/charts/ingress-controller/ --version "${version}"
helm package ./helm-chart/charts/tools/charts/akhq/
helm package ./helm-chart/charts/tools/charts/kafka-connect/
find . -iname "*.tgz" -exec helm s3 push --force {} airy \;
