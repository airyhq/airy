#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

for os in "linux" "darwin" "windows"
do
    sha256sum bazel-bin/infrastructure/cli/airy_"$os"_bin > bazel-bin/infrastructure/cli/airy_"$os"_bin.sha
    aws s3 cp bazel-bin/infrastructure/cli/airy_"$os"_bin s3://airy-core-binaries/"$(cat ./VERSION)"/"$os"/amd64/airy
    aws s3 cp bazel-bin/infrastructure/cli/airy_"$os"_bin.sha s3://airy-core-binaries/"$(cat ./VERSION)"/"$os"/amd64/airy.sha
done

cat ./VERSION > stable.txt
aws s3 cp stable.txt https://airy-core-binaries.s3.amazonaws.com/stable.txt