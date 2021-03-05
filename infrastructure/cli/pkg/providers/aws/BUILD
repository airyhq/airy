load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "aws",
    srcs = ["aws.go"],
    importpath = "cli/pkg/providers/aws",
    visibility = ["//visibility:public"],
    deps = ["//infrastructure/cli/pkg/kube"],
)
