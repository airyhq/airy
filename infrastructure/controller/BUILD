# gazelle:prefix controller
# gazelle:prefix k8s.io/kubernetes
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_push.bzl", "container_push")

go_library(
    name = "controller_lib",
    srcs = ["main.go"],
    importpath = "github.com/airyhq/airy/infrastructure/controller",
    visibility = ["//visibility:private"],
    deps = [
        "//infrastructure/controller/pkg/configmap-controller",
        "//infrastructure/lib/go/k8s/handler",
        "//infrastructure/lib/go/k8s/util",
        "@io_k8s_client_go//kubernetes",
        "@io_k8s_client_go//tools/clientcmd",
        "@io_k8s_klog//:klog",
    ],
)

go_binary(
    name = "controller",
    out = "controller",
    embed = [":kubernetes_lib"],
    visibility = ["//visibility:public"],
)

go_image(
    name = "image",
    embed = [":controller_lib"],
)

container_push(
    registry = "ghcr.io/airyhq/infrastructure",
    repository = "controller",
)

go_library(
    name = "kubernetes_lib",
    srcs = ["main.go"],
    importpath = "k8s.io/kubernetes",
    visibility = ["//visibility:private"],
    deps = [
        "//infrastructure/controller/pkg/configmap-controller",
        "@io_k8s_client_go//kubernetes",
        "@io_k8s_client_go//tools/clientcmd",
        "@io_k8s_klog//:klog",
    ],
)
