load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "config",
    srcs = ["config.go"],
    importpath = "cli/pkg/cmd/config",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/workspace",
        "//lib/go/httpclient",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
        "@in_gopkg_yaml_v2//:yaml_v2",
    ],
)

check_pkg(name = "buildifier")
