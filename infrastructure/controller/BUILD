load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

# gazelle:prefix github.com/airyhq/airy/infrastructure/controller
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_release.bzl", "container_release")

go_library(
    name = "controller_lib",
    srcs = ["main.go"],
    importpath = "github.com/airyhq/airy/infrastructure/controller",
    visibility = ["//visibility:private"],
    deps = [
        "//infrastructure/controller/pkg/configmap-controller",
        "//infrastructure/controller/pkg/endpoints",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
        "@io_k8s_klog//:klog",
    ],
)

go_binary(
    name = "controller",
    out = "controller",
    embed = [":controller_lib"],
    visibility = ["//visibility:public"],
)

go_image(
    name = "image",
    embed = [":controller_lib"],
)

container_release(
    registry = "ghcr.io/airyhq/infrastructure",
    repository = "controller",
)

check_pkg(name = "buildifier")
