load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")
# gazelle:prefix github.com/airyhq/airy/lib/go/k8s

go_library(
    name = "k8s",
    srcs = ["configmaps.go"],
    importpath = "github.com/airyhq/airy/lib/go/k8s",
    visibility = ["//visibility:public"],
    deps = [
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
    ],
)

check_pkg(name = "buildifier")
