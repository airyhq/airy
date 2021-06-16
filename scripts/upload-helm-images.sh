#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

bucket_name="airy-core-helm-charts"
version=$(cat ./VERSION)

sudo snap install helm --classic

mkdir helm-repo
cd helm-repo
helm package ../infrastructure/helm-chart/charts/prerequisites/charts/kafka
helm package ../infrastructure/helm-chart/charts/prerequisites/charts/beanstalkd/
helm package ../infrastructure/helm-chart/charts/core/
helm package ../infrastructure/helm-chart/charts/tools/charts/akhq/
helm repo index .

# case ${GITHUB_BRANCH} in
# refs/heads/develop)
#     s3_basepath=s3://$bucket_name/develop
#     ;;
# refs/heads/release*)
#     s3_basepath=s3://$bucket_name/$version-rc
#     ;;
# refs/heads/main)
#     s3_basepath=s3://$bucket_name/$version
#     ;;
# esac

s3_basepath=s3://$bucket_name/${version}

for i in $(ls -1); do sha256sum ${i} > ${i}.sha256sum.txt; done
for i in $(ls -1); do aws s3 cp ${i} "${s3_basepath}/"; done

if [[ "${GITHUB_BRANCH}" == "refs/heads/main" ]]
then
    aws s3 cp ../VERSION s3://$bucket_name/stable.txt
fi
