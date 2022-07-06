load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "aws",
    srcs = [
        "aws.go",
        "files.go",
    ],
    embedsrcs = [
        "rolepolicy.json",
        "kubeConfigTemplate.yaml",
    ],
    importpath = "cli/pkg/providers/aws",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/kube",
        "//cli/pkg/workspace",
        "//cli/pkg/workspace/template",
        "@com_github_aws_aws_sdk_go//aws",
        "@com_github_aws_aws_sdk_go_v2_config//:config",
        "@com_github_aws_aws_sdk_go_v2_service_ec2//:ec2",
        "@com_github_aws_aws_sdk_go_v2_service_ec2//types",
        "@com_github_aws_aws_sdk_go_v2_service_eks//:eks",
        "@com_github_aws_aws_sdk_go_v2_service_eks//types",
        "@com_github_aws_aws_sdk_go_v2_service_iam//:iam",
        "@com_github_aws_aws_sdk_go_v2_service_iam//types",
        "@com_github_hashicorp_go_getter//:go-getter",
        "@com_github_twinproduction_go_color//:go-color",
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
    ],
)
