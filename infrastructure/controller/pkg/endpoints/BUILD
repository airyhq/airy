load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "endpoints",
    srcs = [
        "auth.go",
        "cluster_get.go",
        "enable_disable_components.go",
        "server.go",
        "services.go",
    ],
    importpath = "github.com/airyhq/airy/infrastructure/controller/pkg/endpoints",
    visibility = ["//visibility:public"],
    deps = [
        "//lib/go/kubectl/configmaps",
        "@com_github_golang_jwt_jwt//:jwt",
        "@com_github_gorilla_mux//:mux",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_klog//:klog",
    ],
)

check_pkg(name = "buildifier")
