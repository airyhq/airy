load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "scheduler",
    srcs = ["scheduler.go"],
    importmap = "backend/webhook/consumer/pkg/scheduler",
    importpath = "redis-worker/pkg/scheduler",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/consumer/pkg/scheduler/consumer",
        "//backend/webhook/consumer/pkg/scheduler/queue",
    ],
)

go_library(
    name = "go_default_library",
    srcs = ["scheduler.go"],
    importpath = "scheduler/pkg/scheduler",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/consumer/pkg/scheduler/consumer",
        "//backend/webhook/consumer/pkg/scheduler/queue",
    ],
)
