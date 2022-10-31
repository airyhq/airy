load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "providers",
    srcs = ["provider.go"],
    importpath = "cli/pkg/providers",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/kube",
        "//cli/pkg/providers/aws",
        "//cli/pkg/providers/gcp",
        "//cli/pkg/providers/minikube",
        "//cli/pkg/workspace",
        "//cli/pkg/workspace/template",
    ],
)
