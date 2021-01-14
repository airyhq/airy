load("@io_bazel_rules_go//go:def.bzl", "go_library")

# gazelle:prefix github.com/airyhq/airy/lib/go/httpclient

go_library(
    name = "httpclient",
    srcs = [
        "httpclient.go",
        "users.go",
    ],
    importpath = "github.com/airyhq/airy/lib/go/httpclient",
    visibility = ["//visibility:public"],
    deps = ["//lib/go/httpclient/payloads"],
)
