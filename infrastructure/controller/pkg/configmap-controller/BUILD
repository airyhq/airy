# gazelle:prefix configmap-controller
# gazelle:prefix k8s.io/kubernetes
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "configmap-controller",
    srcs = ["configmap-controller.go"],
    importpath = "github.com/airyhq/airy/infrastructure/controller/pkg/configmap-controller",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/lib/go/k8s/handler",
        "//infrastructure/lib/go/k8s/util",
        "@io_k8s_api//core/v1:core",
        "@io_k8s_apimachinery//pkg/fields",
        "@io_k8s_apimachinery//pkg/util/runtime",
        "@io_k8s_apimachinery//pkg/util/wait",
        "@io_k8s_client_go//kubernetes",
        "@io_k8s_client_go//tools/cache",
        "@io_k8s_client_go//util/workqueue",
        "@io_k8s_klog//:klog",
    ],
)
