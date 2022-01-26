#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "web target to run: $1"
echo "starting devserver"
if [ -n "$2" ]; then
  echo "Using custom host: https://${@:2}.airy.co"
  echo "${@:3}"  
  bazel run "$1" -- --defines="{\"process.env.API_HOST\":\"'https://${@:2}.airy.co'\"}" "${@:3}"
else
  echo "${@:2}"
  bazel run "$1" -- --defines="{\"process.env.API_HOST\":\"'http://airy.core'\"}" "${@:2}"  
fi
