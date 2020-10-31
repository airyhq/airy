#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

echo $AIRY_GITHUB_TOKEN
echo $GITHUB_USER

echo $AIRY_GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USER --password-stdin

release_targets=$(bazel query "filter("release$", //...)" --output label)

for target in $release_targets; do
  echo "Deploying $target"
  bazel run $target
done

