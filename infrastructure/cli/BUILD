# gazelle:prefix cli
# gazelle:importmap_prefix infrastructure
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library", "go_test")

go_library(
    name = "cli_lib",
    srcs = ["main.go"],
    importmap = "infrastructure",
    importpath = "cli",
    visibility = ["//visibility:private"],
    deps = ["//infrastructure/cli/cmd"],
)

go_binary(
    name = "airy",
    out = "airy",
    embed = [":cli_lib"],
    visibility = ["//visibility:public"],
)

go_test(
    name = "cli_test",
    srcs = ["main_test.go"],
    data = [
        "airy",
        "//infrastructure/cli/pkg/tests/golden:golden_files",
    ],
    embed = [":cli_lib"],
    deps = ["//infrastructure/cli/pkg/tests"],
)
