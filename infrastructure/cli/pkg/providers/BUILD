load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "providers",
    srcs = ["providers.go"],
    importpath = "cli/pkg/providers",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/cli/pkg/providers/aws",
        "//infrastructure/cli/pkg/providers/minikube",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)
