load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "console",
    srcs = [
        "failure.go",
        "output.go",
        "segment.go",
    ],
    importpath = "cli/pkg/console",
    visibility = ["//visibility:public"],
    deps = [
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
    ],
)
