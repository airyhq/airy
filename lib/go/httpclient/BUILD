# gazelle:prefix httpclient
# gazelle:importmap_prefix lib/go
load("@io_bazel_rules_go//go:def.bzl", "go_library")

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
