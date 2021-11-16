load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "kube",
    srcs = [
        "configmaps.go",
        "context.go",
    ],
    importpath = "cli/pkg/kube",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_spf13_viper//:viper",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//plugin/pkg/client/auth/gcp:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)
