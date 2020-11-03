# gazelle:prefix scheduler

load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

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

load("@io_bazel_rules_docker//go:image.bzl", "go_image")

go_image(
    name = "go_image",
    embed = [":go_default_library"],
)

load("@io_bazel_rules_docker//container:container.bzl", "container_push")

container_push(
    name = "release",
    format = "Docker",
    image = ":go_image",
    registry = "docker.pkg.github.com/airyhq",
    repository = "airy/webhook-consumer",
    tag = "latest",
)
