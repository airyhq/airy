load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

check_pkg(name = "buildifier")

go_library(
    name = "worker",
    srcs = ["worker.go"],
    importpath = "consumer/pkg/worker",
    visibility = ["//visibility:public"],
    deps = ["@com_github_beanstalkd_go_beanstalk//:go-beanstalk"],
)
