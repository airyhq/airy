load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "gcp",
    srcs = ["gcp.go"],
    importpath = "cli/pkg/providers/gcp",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/workspace",
        "//cli/pkg/workspace/template",
        "//lib/go/tools",
        "@com_github_hashicorp_go_getter//:go-getter",
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
    ],
)
