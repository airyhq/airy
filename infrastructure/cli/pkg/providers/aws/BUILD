load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "aws",
    srcs = ["aws.go"],
    importpath = "cli/pkg/providers/aws",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/cli/pkg/kube",
        "@com_github_aws_aws_sdk_go_v2_config//:config",
        "@com_github_aws_aws_sdk_go_v2_service_ec2//:ec2",
        "@com_github_aws_aws_sdk_go_v2_service_eks//:eks",
        "@com_github_aws_aws_sdk_go_v2_service_eks//types",
    ],
)
