load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

# gazelle:prefix github.com/airyhq/airy/lib/go/httpclient

go_library(
    name = "httpclient",
    srcs = [
        "client.go",
        "components.go",
        "httpclient.go",
    ],
    importpath = "github.com/airyhq/airy/lib/go/httpclient",
    visibility = ["//visibility:public"],
    deps = [
        "//lib/go/config",
        "//lib/go/payloads",
    ],
)

check_pkg(name = "buildifier")
