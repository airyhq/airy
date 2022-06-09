load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "upgrade",
    srcs = ["upgrade.go"],
    importpath = "cli/pkg/cmd/upgrade",
    visibility = ["//visibility:public"],
    x_defs = {
        "Version": "{STABLE_VERSION}",
    },
    deps = [
        "//cli/pkg/cmd/config",
        "//cli/pkg/console",
        "//cli/pkg/helm",
        "//cli/pkg/kube",
        "//cli/pkg/workspace",
        "//infrastructure/lib/go/k8s/util",
        "//lib/go/k8s",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)

check_pkg(name = "buildifier")
