load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "create",
    srcs = ["create.go"],
    importpath = "cli/cmd/create",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_aws_aws_sdk_go_v2//aws",
        "@com_github_spf13_cobra//:cobra",
    ],
)
