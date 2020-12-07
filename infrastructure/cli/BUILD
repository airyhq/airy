# gazelle:prefix cli
# gazelle:importmap_prefix infrastructure
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library", "go_test")

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importmap = "infrastructure",
    importpath = "cli",
    visibility = ["//visibility:private"],
    deps = ["//infrastructure/cli/cmd:go_default_library"],
)

go_binary(
    name = "airy",
    out = "airy",
    embed = [":go_default_library"],
    visibility = ["//visibility:public"],
)

go_test(
    name = "go_default_test",
    srcs = ["main_test.go"],
    data = [
        "airy",
        "//infrastructure/cli/pkg/tests/golden:golden_files",
    ],
    embed = [":go_default_library"],
    deps = [
        "//infrastructure/cli/pkg/tests:go_default_library",
    ],
)
