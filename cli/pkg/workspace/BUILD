load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "workspace",
    srcs = [
        "files.go",
        "init.go",
    ],
    embedsrcs = ["template/airy.yaml"],
    importpath = "cli/pkg/workspace",
    visibility = ["//visibility:public"],
    deps = ["@com_github_spf13_viper//:viper"],
)
