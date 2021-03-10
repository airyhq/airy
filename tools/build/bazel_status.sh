#!/bin/bash

set -o errexit
set -o pipefail

echo STABLE_GIT_COMMIT $(git rev-parse HEAD)

if [[ $CI = true ]]; then
  BRANCH=$(echo "$GITHUB_REF" | sed -e "s/^refs\/heads\///")
else
  BRANCH=$(git branch --show-current)
fi

if [[ $BRANCH == "develop" ]]; then
  echo STABLE_VERSION "develop"
else
  echo STABLE_VERSION $(cat ./VERSION)
fi

echo PROJECT_DIR $(pwd)
