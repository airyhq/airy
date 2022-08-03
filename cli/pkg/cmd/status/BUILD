load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "status",
    srcs = ["status.go"],
    importpath = "cli/pkg/cmd/status",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//lib/go/httpclient",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
    ],
)

check_pkg(name = "buildifier")
