#!/usr/bin/env bash

echo STABLE_GIT_COMMIT $(git rev-parse HEAD)

echo STABLE_VERSION $(cat ./VERSION)