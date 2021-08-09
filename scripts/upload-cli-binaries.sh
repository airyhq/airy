#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

arch="amd64"
bucket_name="airy-core-binaries"
version=$(cat ./VERSION)

for os in "linux" "darwin" "windows"; do
    airy_bin_path=bazel-bin/cli/airy_"$os"_bin
    airy_bin_sha_path=bazel-bin/cli/airy_"$os"_sha256sum.txt
    if [[ ${os} = "windows" ]]; then filename="airy.exe"; else filename="airy"; fi

    case ${GITHUB_BRANCH} in
    refs/heads/develop)
        s3_basepath=s3://$bucket_name/$version/$os/$arch
        ;;
    refs/heads/release*)
        s3_basepath=s3://$bucket_name/$version-rc/$os/$arch
        ;;
    refs/heads/main)
        s3_basepath=s3://$bucket_name/$version/$os/$arch
        aws s3 cp VERSION s3://$bucket_name/stable.txt
        ;;
    esac

    sha256sum $airy_bin_path >$airy_bin_sha_path
    aws s3 cp $airy_bin_path "$s3_basepath/$filename"
    aws s3 cp $airy_bin_sha_path "$s3_basepath/"
done
