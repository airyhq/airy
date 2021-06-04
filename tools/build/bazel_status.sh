#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo STABLE_GIT_COMMIT $(git rev-parse HEAD)

if [[ ${CI+x} ]]; then
  BRANCH=$(echo "$GITHUB_REF" | sed -e "s/^refs\/heads\///")
else
  BRANCH=$(git branch --show-current)
fi

echo STABLE_VERSION $(cat ./VERSION)

echo PROJECT_DIR $(pwd)
