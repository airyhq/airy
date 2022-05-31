load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "minikube",
    srcs = [
        "minikube.go",
    ],
    importpath = "cli/pkg/providers/minikube",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/kube",
        "//cli/pkg/workspace",
        "//cli/pkg/workspace/template",
        "@com_github_txn2_txeh//:txeh",
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//util/homedir:go_default_library",
    ],
)
