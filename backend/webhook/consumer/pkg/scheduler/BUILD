load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

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

go_test(
    name = "go_default_test",
    srcs = ["scheduler_test.go"],
    embed = [":go_default_library"],
    deps = [
        "//backend/webhook/consumer/pkg/scheduler/queue",
        "@com_github_alicebob_miniredis_v2//:go_default_library",
    ],
)
