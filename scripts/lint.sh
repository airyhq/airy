#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "Running Prettier, Buildifier and Checkstyle"
bazel test --test_tag_filters=lint //...
echo
echo "Check create-topics.sh is in sync"
bazel run //infrastructure/tools/topics:app > /tmp/topics-output
cmp /tmp/topics-output infrastructure/helm-chart/charts/core/charts/provisioning/templates/kafka-create-topics.yaml
echo
echo "Check cli doc is in sync"
cp docs/docs/cli/usage.md /tmp/
bazel run //docs/cli-doc:generate_cli_docs
cmp docs/docs/cli/usage.md  /tmp/usage.md
echo
echo "Running shellcheck on *.sh"
find infrastructure scripts -type f -name "*.sh" -exec shellcheck {} +
