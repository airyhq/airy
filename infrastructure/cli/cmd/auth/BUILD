load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "auth",
    srcs = ["auth.go"],
    importmap = "infrastructure/cmd/auth",
    importpath = "cli/cmd/auth",
    visibility = ["//visibility:public"],
    deps = [
        "//lib/go/apiclient",
        "//lib/go/apiclient/payloads",
        "@com_github_spf13_cobra//:cobra",
    ],
)
