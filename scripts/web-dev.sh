#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "web target to run: $1"
echo "starting devserver with ibazel"
ibazel run "$1" -- --defines="{\"process.env.API_HOST\":\"'http://airy.core'\"}"
