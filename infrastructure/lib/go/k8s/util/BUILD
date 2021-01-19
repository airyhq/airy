# gazelle:prefix github.com/airyhq/airy/infrastructure/lib/go/k8s/util

load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "util",
    srcs = ["util.go"],
    importpath = "github.com/airyhq/airy/infrastructure/lib/go/k8s/util",
    visibility = ["//visibility:public"],
    deps = [
        "@io_k8s_api//core/v1:core",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:meta",
        "@io_k8s_klog//:klog",
    ],
)
