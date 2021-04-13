load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "scheduler",
    srcs = ["scheduler.go"],
    importpath = "beanstalk-worker/pkg/scheduler",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/beanstalk-worker/pkg/scheduler/consumer",
        "@com_github_beanstalkd_go_beanstalk//:go-beanstalk",
    ],
)

check_pkg(name = "buildifier")
