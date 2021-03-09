load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "minikube",
    srcs = ["minikube.go"],
    importpath = "cli/pkg/providers/minikube",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/cli/pkg/kube",
        "@io_k8s_client_go//util/homedir:go_default_library",
    ],
)
