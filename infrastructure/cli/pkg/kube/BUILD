load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "k8s_cluster",
    srcs = ["context.go"],
    importpath = "cli/pkg/k8s_cluster",
    visibility = ["//visibility:public"],
    deps = [
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)

go_library(
    name = "kube",
    srcs = ["context.go"],
    importpath = "cli/pkg/kube",
    visibility = ["//visibility:public"],
    deps = [
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)
