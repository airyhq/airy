# gazelle:prefix github.com/airyhq/airy/infrastructure/lib/go/k8s/handler

load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "handler",
    srcs = [
        "callbacks.go",
        "config.go",
        "configmaps.go",
        "containers.go",
        "deployments.go",
    ],
    importpath = "github.com/airyhq/airy/infrastructure/lib/go/k8s/handler",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/lib/go/k8s/util",
        "@io_k8s_api//apps/v1:apps",
        "@io_k8s_api//core/v1:core",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:meta",
        "@io_k8s_client_go//kubernetes",
        "@io_k8s_client_go//util/retry",
        "@io_k8s_klog//:klog",
    ],
)
