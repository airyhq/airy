#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo STABLE_GIT_COMMIT $(git rev-parse HEAD)

echo STABLE_VERSION $(cat ./VERSION)

echo PROJECT_DIR $(pwd)
