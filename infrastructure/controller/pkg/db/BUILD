load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "db",
    srcs = ["dynamodb.go"],
    importpath = "github.com/airyhq/airy/infrastructure/controller/pkg/db",
    visibility = ["//visibility:public"],
    deps = ["@com_github_aws_aws_sdk_go_v2//aws"],
)
