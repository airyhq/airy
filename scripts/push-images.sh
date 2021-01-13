#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

BRANCH_TARGET=$(echo $1 | cut -d'/' -f3)

echo "Branch target: ${BRANCH_TARGET}"

case ${BRANCH_TARGET} in
  develop)
    tag="develop"
    ;;

  main|release)
    tag=`(cat ../VERSION)`
    ;;
esac

release_targets=$(bazel query "filter("${tag}$", //...)" --output label)

for target in $release_targets; do
  echo "Deploying $target"
  bazel run $target
done
