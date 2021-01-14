#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

echo "Check create-topics.sh is in sync"
cmp <(bazel run //infrastructure/tools/topics:app) infrastructure/scripts/provision/create-topics.sh
echo
echo "Running Bazel lint"
bazel run  --profile buildifier.log @com_github_airyhq_bazel_tools//code-format:check_buildifier
echo "Buildifier profile"
bazel analyze-profile buildifier.log
echo
echo "Running Prettier and Java tests"
bazel test --profile lint_tests.log --test_tag_filters=lint //...
echo "Lint tests profile"
bazel analyze-profile lint_tests.log
echo
echo "Running eslint"
yarn eslint
