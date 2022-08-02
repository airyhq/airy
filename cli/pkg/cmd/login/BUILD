load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

check_pkg(name = "buildifier")

go_library(
    name = "login",
    srcs = ["login.go"],
    importpath = "cli/pkg/cmd/login",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
        "@org_golang_x_term//:term",
    ],
)
