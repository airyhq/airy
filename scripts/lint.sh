#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "Check create-topics.sh is in sync"
bazel run //infrastructure/tools/topics:app > /tmp/topics-output
cmp /tmp/topics-output infrastructure/helm-chart/charts/provisioning/templates/kafka-create-topics.yaml
echo
echo "Check cli doc is in sync"
cp docs/docs/cli/reference.md /tmp/
bazel run //docs/cli-doc:generate_cli_docs
cmp docs/docs/cli/reference.md  /tmp/reference.md
echo
echo "Running Prettier, Buildifier, Shellcheck and Checkstyle"
bazel test --test_tag_filters=lint //...
echo
