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

os_list = [
    "linux",
    "darwin",
    "windows",
]

[
    go_binary(
        name = "airy_" + os,
        out = "airy_" + os,
        embed = [":cli_lib"],
        goarch = "amd64",
        goos = os,
        visibility = ["//visibility:public"],
    )
    for os in os_list
]

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

[
    genrule(
        name = "airy_" + os + "_bin_rule",
        srcs = [":airy_" + os],
        outs = ["airy_" + os + "_bin"],
        cmd = "cp $(SRCS) $@",
    )
    for os in os_list
]
