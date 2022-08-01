load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "cache",
    srcs = ["deployed_charts.go"],
    importpath = "github.com/airyhq/airy/infrastructure/controller/pkg/cache",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_mittwald_go_helm_client//:go-helm-client",
        "@io_k8s_klog//:klog",
    ],
)
