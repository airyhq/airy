load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "api",
    srcs = [
        "api.go",
        "login.go",
        "signup.go",
    ],
    importpath = "cli/cmd/api",
    visibility = ["//visibility:public"],
    deps = [
        "//lib/go/httpclient",
        "//lib/go/httpclient/payloads",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)

check_pkg(name = "buildifier")
