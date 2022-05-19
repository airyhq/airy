load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")
# gazelle:prefix github.com/airyhq/airy/lib/go/kubectl/configmaps

go_library(
    name = "configmaps",
    srcs = ["get.go"],
    importpath = "github.com/airyhq/airy/lib/go/kubectl/configmaps",
    visibility = ["//visibility:public"],
    deps = [
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
    ],
)

check_pkg(name = "buildifier")
