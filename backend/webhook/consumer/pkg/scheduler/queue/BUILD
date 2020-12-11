load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "queue",
    srcs = ["queue.go"],
    importpath = "redis-worker/pkg/scheduler/queue",
    visibility = ["//visibility:public"],
    deps = ["@com_github_go_redis_redis_v8//:go_default_library"],
)

go_library(
    name = "go_default_library",
    srcs = ["queue.go"],
    importpath = "scheduler/pkg/scheduler/queue",
    visibility = ["//visibility:public"],
    deps = ["@com_github_go_redis_redis_v8//:go_default_library"],
)
