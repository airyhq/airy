#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

file_name="docs/docs/changelog.md"

echo "---
title: Changelog
sidebar_label: 📝 Changelog
---
" > ${file_name}

curl -H "Authorization: token ${GITHUB_TOKEN}" --request GET \
  --url https://api.github.com/repos/airyhq/airy/releases \
  | sed "s/##/####/g" | jq -r '.[] | "## \(.name)\n\n\(.body)"' \
  | sed -E "s/\[\#([0-9]*)\]/[[#\1](https:\/\/github.com\/airyhq\/airy\/issues\/\1)]/g" \
  | sed -E "s/\(\#([0-9]*)\)/[[#\1](https:\/\/github.com\/airyhq\/airy\/pull\/\1)]/g" \
  >> ${file_name}
