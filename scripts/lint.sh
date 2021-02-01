#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "Check create-topics.sh is in sync"
cmp <(bazel run //infrastructure/tools/topics:app) infrastructure/scripts/provision/create-topics.sh
echo
echo "Check cli doc is in sync"
cp docs/docs/cli/*.md /tmp/
bazel run //docs/cli-doc:generate_cli_docs
for filename in docs/docs/cli/*.md; do
    cmp $filename /tmp/$(basename -- "$filename")
done
echo
echo "Running Bazel lint"
bazel run @com_github_airyhq_bazel_tools//code-format:check_buildifier
echo
echo "Running Prettier and Java tests"
bazel test --test_tag_filters=lint //...
echo
echo "Running eslint"
yarn eslint
