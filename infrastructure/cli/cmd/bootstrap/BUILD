load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = ["bootstrap.go"],
    importmap = "infrastructure/cmd/bootstrap",
    importpath = "cli/cmd/bootstrap",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_spf13_cobra//:go_default_library",
    ],
)
