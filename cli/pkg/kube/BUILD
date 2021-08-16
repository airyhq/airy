load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "kube",
    srcs = [
        "configmaps.go",
        "context.go",
        "hosts.go",
    ],
    importpath = "cli/pkg/kube",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/workspace",
        "@com_github_spf13_viper//:viper",
        "@in_gopkg_yaml_v2//:yaml_v2",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)
