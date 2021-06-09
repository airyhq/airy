#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

bucket_name="airy-core-helm-charts"
version=$(cat ./VERSION)

mkdir helm-repo
cd helm-repo
helm package ../infrastructure/charts/prerequisites/charts/kafka/
helm package ../infrastructure/charts/prerequisites/charts/beanstalkd/
helm package ../infrastructure/charts/core/
helm package ../infrastructure/charts/tools/akhq/


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

s3_basepath=s3://$bucket_name/ljupco

sha256sum $airy_bin_path >$airy_bin_sha_path
aws s3 cp $airy_bin_path "$s3_basepath/$filename"
aws s3 cp $airy_bin_sha_path "$s3_basepath/"

aws s3 cp VERSION s3://$bucket_name/stable.txt
