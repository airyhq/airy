load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "configmap-controller",
    srcs = [
        "controller.go",
        "create.go",
        "delete.go",
        "update.go",
    ],
    importpath = "github.com/airyhq/airy/infrastructure/controller/pkg/configmap-controller",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/lib/go/k8s/handler",
        "//infrastructure/lib/go/k8s/util",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/fields:go_default_library",
        "@io_k8s_apimachinery//pkg/util/runtime:go_default_library",
        "@io_k8s_apimachinery//pkg/util/wait:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/cache:go_default_library",
        "@io_k8s_client_go//util/workqueue:go_default_library",
        "@io_k8s_klog//:klog",
    ],
)

check_pkg(name = "buildifier")
