load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "demo",
    srcs = ["demo.go"],
    importmap = "infrastructure/cmd/demo",
    importpath = "cli/cmd/demo",
    visibility = ["//visibility:public"],
    deps = ["@com_github_spf13_cobra//:cobra"],
)
