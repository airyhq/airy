# gazelle:prefix scheduler

load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_push.bzl", "container_push")

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importpath = "scheduler",
    visibility = ["//visibility:private"],
    deps = ["//backend/webhook/consumer/pkg/scheduler"],
)

go_binary(
    name = "scheduler_binary",
    embed = [":go_default_library"],
    visibility = ["//visibility:public"],
)

go_image(
    name = "image",
    embed = [":go_default_library"],
)

container_push(
    registry = "ghcr.io/airyhq/webhook",
    repository = "consumer",
)
