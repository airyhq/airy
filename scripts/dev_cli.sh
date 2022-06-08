#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

brew install -q coreutils wget

VERSION=$(cat ./VERSION)
AIRY_BIN=/usr/local/bin/airy_dev
BUCKET=https://airy-core-binaries.s3.amazonaws.com/${VERSION}/darwin/amd64

OLD_SHA=$(sha256sum $AIRY_BIN | cut -f1 -d ' ') || echo "Downloading airy_dev"
NEW_SHA=$(wget -qO - "${BUCKET}/airy_darwin_sha256sum.txt" | cut -f1 -d ' ')

if [[ "$OLD_SHA" != "$NEW_SHA" ]]; then
  wget "${BUCKET}/airy" -O $AIRY_BIN
  chmod +x $AIRY_BIN
fi

if [[ $1 == "create" ]]; then
  if [[ $2 == "--provider=minikube" ]]; then
    minikube delete -p airy-core
  fi
  $AIRY_BIN "$@" --disable-tracking
  $AIRY_BIN config apply
else 
  $AIRY_BIN "$@"
fi
