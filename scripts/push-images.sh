#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

BRANCH_TARGET=$(echo $1 | cut -d'/' -f3)

if [[ ${BRANCH_TARGET} == "develop" ]]; then
  cd "$(git rev-parse --show-toplevel)"
  files=$(git diff-tree --no-commit-id --name-only -r ${GIT_COMMIT})
  release_targets=$(bazel query --keep_going "filter("beta$", rdeps(//..., set(${files[*]})))" --output label)
else
  [[ ${BRANCH_TARGET} == "main" ]] && tag="latest" || tag="release"
  release_targets=$(bazel query "filter("${tag}$", //...)" --output label)
fi

for target in $release_targets; do
  echo "Deploying $target"
  bazel run $target
done
