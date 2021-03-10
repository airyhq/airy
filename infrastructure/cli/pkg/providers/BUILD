load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "providers",
    srcs = ["provider.go"],
    importpath = "cli/pkg/providers",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/cli/pkg/kube",
        "//infrastructure/cli/pkg/providers/aws",
        "//infrastructure/cli/pkg/providers/minikube",
    ],
)
