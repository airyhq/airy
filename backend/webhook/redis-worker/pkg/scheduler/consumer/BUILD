load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "consumer",
    srcs = ["consumer.go"],
    importpath = "redis-worker/pkg/scheduler/consumer",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/redis-worker/pkg/scheduler/queue",
        "@com_github_go_redis_redis_v8//:redis",
    ],
)
