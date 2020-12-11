load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "consumer",
    srcs = ["consumer.go"],
    importmap = "backend/webhook/consumer/pkg/consumer",
    importpath = "redis-worker/pkg/scheduler/consumer",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/consumer/pkg/scheduler/queue",
        "@com_github_go_redis_redis_v8//:go_default_library",
    ],
)

go_library(
    name = "go_default_library",
    srcs = ["consumer.go"],
    importpath = "scheduler/pkg/scheduler/consumer",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/consumer/pkg/scheduler/queue",
        "@com_github_go_redis_redis_v8//:go_default_library",
    ],
)
