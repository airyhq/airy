load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "consumer",
    srcs = ["consumer.go"],
    importpath = "beanstalk-worker/pkg/scheduler/consumer",
    visibility = ["//visibility:public"],
    deps = ["@com_github_beanstalkd_go_beanstalk//:go-beanstalk"],
)

check_pkg(name = "buildifier")
