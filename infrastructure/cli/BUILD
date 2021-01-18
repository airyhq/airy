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
    name = "airy_linux",
    out = "airy_linux",
    embed = [":cli_lib"],
    goarch = "amd64",
    goos = "linux",
    visibility = ["//visibility:public"],
)

go_binary(
    name = "airy_darwin",
    out = "airy_darwin",
    embed = [":cli_lib"],
    goarch = "amd64",
    goos = "darwin",
    visibility = ["//visibility:public"],
)

go_binary(
    name = "airy_windows",
    out = "airy_windows",
    embed = [":cli_lib"],
    goarch = "amd64",
    goos = "windows",
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

genrule(
    name = "airy_linux_bin",
    srcs = [":airy_linux"],
    outs = ["airy_linux_bin"],
    cmd = "cp $(SRCS) $@",
)

genrule(
    name = "airy_darwin_bin",
    srcs = [":airy_darwin"],
    outs = ["airy_darwin_bin"],
    cmd = "cp $(SRCS) $@",
)

genrule(
    name = "airy_windows_bin",
    srcs = [":airy_windows"],
    outs = ["airy_windows_bin"],
    cmd = "cp $(SRCS) $@",
)
