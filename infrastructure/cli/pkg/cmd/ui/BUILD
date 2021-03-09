load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "ui",
    srcs = ["ui.go"],
    importpath = "cli/pkg/cmd/ui",
    visibility = ["//visibility:public"],
    deps = ["@com_github_spf13_cobra//:cobra"],
)

check_pkg(name = "buildifier")
