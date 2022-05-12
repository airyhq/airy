load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "api",
    srcs = [
        "api.go",
        "endpoint.go",
    ],
    importpath = "cli/pkg/cmd/api",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/kube",
        "//lib/go/k8s",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)

check_pkg(name = "buildifier")
