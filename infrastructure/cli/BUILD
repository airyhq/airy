load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")

# gazelle:prefix cli
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

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
    x_defs = {
        "cmd.CommitSHA1": "{STABLE_GIT_COMMIT}",
        "cmd.Version": "{STABLE_VERSION}",
    },
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
        x_defs = {
            "cmd.CommitSHA1": "{STABLE_GIT_COMMIT}",
            "cmd.Version": "{STABLE_VERSION}",
        },
    )
    for os in os_list
]

[
    genrule(
        name = "airy_" + os + "_bin_rule",
        srcs = [":airy_" + os],
        outs = ["airy_" + os + "_bin"],
        cmd = "cp $(SRCS) $@",
    )
    for os in os_list
]

check_pkg(name = "buildifier")
