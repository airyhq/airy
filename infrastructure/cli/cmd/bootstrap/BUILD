load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "bootstrap",
    srcs = ["bootstrap.go"],
    importmap = "infrastructure/cmd/bootstrap",
    importpath = "cli/cmd/bootstrap",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_spf13_cobra//:cobra",
    ],
)
