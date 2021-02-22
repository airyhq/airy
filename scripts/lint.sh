#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "Check create-topics.sh is in sync"
cmp <(bazel run //infrastructure/tools/topics:app) infrastructure/helm-chart/charts/provisioning/templates/kafka-create-topics.yaml
echo
echo "Check cli doc is in sync"
cp docs/docs/cli/reference.md /tmp/
bazel run //docs/cli-doc:generate_cli_docs
cmp docs/docs/cli/reference.md  /tmp/reference.md
echo
echo "Running Bazel lint"
bazel run @com_github_airyhq_bazel_tools//code-format:check_buildifier
echo
echo "Running Prettier and Java tests"
bazel test --test_tag_filters=lint //...
echo
echo "Running eslint"
yarn eslint
echo
echo "Running shellcheck on *.sh"
find infrastructure scripts -type f -name "*.sh" -exec shellcheck {} +
