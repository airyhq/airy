load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "helm",
    srcs = ["helm.go"],
    importpath = "cli/pkg/helm",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/kube",
        "//infrastructure/lib/go/k8s/util",
        "@io_k8s_api//batch/v1:go_default_library",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_api//rbac/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/watch:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
    ],
)
