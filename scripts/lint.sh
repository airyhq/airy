#!/usr/bin/env bash
echo "Running Bazel lint"
bazel run //tools/code-format:check_buildifier
echo
echo "Running Prettier and Java tests"
bazel test --test_tag_filters=lint //...
