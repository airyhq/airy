# gazelle:prefix cli
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library", "go_test")

go_library(
    name = "cli_lib",
    srcs = ["main.go"],
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

go_binary(
    name = "airy_darwin",
    out = "airy_darwin",
    goos = "darwin",
    goarch = "amd64",
    embed = [":cli_lib"],
    visibility = ["//visibility:public"],
)

go_binary(
    name = "airy_windows",
    out = "airy_windows",
    goos = "windows",
    goarch = "amd64",
    embed = [":cli_lib"],
    visibility = ["//visibility:public"],
)

go_binary(
    name = "airy_linux",
    out = "airy_linux",
    goos = "linux",
    goarch = "amd64",
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
