#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

for os in "linux" "darwin" "windows"
do
    sha256sum bazel-bin/infrastructure/cli/airy_"$os"_bin > bazel-bin/infrastructure/cli/airy_"$os"_sha256sum.txt
    if [[ ${os} = "windows" ]]
    then
        aws s3 cp bazel-bin/infrastructure/cli/airy_"$os"_bin s3://airy-core-binaries/"$(cat ./VERSION)"/"$os"/amd64/airy.exe
    else
        aws s3 cp bazel-bin/infrastructure/cli/airy_"$os"_bin s3://airy-core-binaries/"$(cat ./VERSION)"/"$os"/amd64/airy
    fi
    aws s3 cp bazel-bin/infrastructure/cli/airy_"$os"_sha256sum.txt s3://airy-core-binaries/"$(cat ./VERSION)"/"$os"/amd64/
done

cat ./VERSION > stable.txt
aws s3 cp stable.txt s3://airy-core-binaries/stable.txt