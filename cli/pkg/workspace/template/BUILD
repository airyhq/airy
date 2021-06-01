load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "template",
    srcs = ["copy.go"],
    embedsrcs = ["src/airy.yaml"],
    importpath = "cli/pkg/workspace/template",
    visibility = ["//visibility:public"],
    deps = ["@com_github_masterminds_sprig//:sprig"],
)
