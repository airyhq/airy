# gazelle:prefix apiclient
# gazelle:importmap_prefix lib/go
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = [
        "apiclient.go",
        "users.go",
    ],
    importmap = "lib/go",
    importpath = "apiclient",
    visibility = ["//visibility:public"],
    deps = ["//lib/go/apiclient/payloads:go_default_library"],
)
