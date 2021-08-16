load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "cmd",
    srcs = ["root.go"],
    importpath = "cli/pkg/cmd",
    visibility = ["//visibility:public"],
    x_defs = {
        "Version": "{STABLE_VERSION}",
        "CommitSHA1": "{STABLE_GIT_COMMIT}",
    },
    deps = [
        "//cli/pkg/cmd/api",
        "//cli/pkg/cmd/config",
        "//cli/pkg/cmd/create",
        "//cli/pkg/cmd/status",
        "//cli/pkg/cmd/ui",
        "//cli/pkg/cmd/upgrade",
        "//cli/pkg/workspace",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)

check_pkg(name = "buildifier")
