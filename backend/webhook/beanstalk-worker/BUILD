# gazelle:prefix beanstalk-worker

load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_release.bzl", "container_release")

go_binary(
    name = "beanstalk-worker_binary",
    embed = [":beanstalk-worker_lib"],
    visibility = ["//visibility:public"],
)

go_image(
    name = "image",
    embed = [":beanstalk-worker_lib"],
)

container_release(
    registry = "ghcr.io/airyhq/webhook",
    repository = "consumer",
)

check_pkg(name = "buildifier")

go_library(
    name = "beanstalk-worker_lib",
    srcs = ["main.go"],
    importpath = "beanstalk-worker",
    visibility = ["//visibility:private"],
    deps = ["//backend/webhook/beanstalk-worker/pkg/scheduler"],
)
