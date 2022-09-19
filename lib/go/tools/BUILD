load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")
# gazelle:prefix github.com/airyhq/airy/lib/go/tools

go_library(
    name = "tools",
    srcs = ["tools.go"],
    importpath = "github.com/airyhq/airy/lib/go/tools",
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
