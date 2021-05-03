# gazelle:prefix consumer

load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_release.bzl", "container_release")

go_binary(
    name = "consumer_binary",
    embed = [":consumer_lib"],
    visibility = ["//visibility:public"],
)

go_image(
    name = "image",
    embed = [":consumer_lib"],
)

container_release(
    registry = "ghcr.io/airyhq/webhook",
    repository = "consumer",
)

check_pkg(name = "buildifier")

go_library(
    name = "consumer_lib",
    srcs = ["main.go"],
    importpath = "consumer",
    visibility = ["//visibility:private"],
    deps = ["//backend/webhook/consumer/pkg/worker"],
)
