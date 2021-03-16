load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "core",
    srcs = [
        "hosts.go",
        "kube.go",
    ],
    importpath = "cli/pkg/core",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_spf13_viper//:viper",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)
