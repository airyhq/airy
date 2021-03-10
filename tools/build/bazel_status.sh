#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo STABLE_GIT_COMMIT $(git rev-parse HEAD)

BRANCH=$(git branch --show-current)

if [[ $BRANCH == "develop" ]]; then
  echo STABLE_VERSION "develop"
else
  echo STABLE_VERSION $(cat ./VERSION)
fi

echo PROJECT_DIR $(pwd)
