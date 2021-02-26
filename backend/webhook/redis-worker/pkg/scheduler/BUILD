load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

go_library(
    name = "scheduler",
    srcs = ["scheduler.go"],
    importpath = "redis-worker/pkg/scheduler",
    visibility = ["//visibility:public"],
    deps = [
        "//backend/webhook/redis-worker/pkg/scheduler/consumer",
        "//backend/webhook/redis-worker/pkg/scheduler/queue",
    ],
)

go_test(
    name = "scheduler_test",
    srcs = ["scheduler_test.go"],
    embed = [":scheduler"],
    deps = [
        "//backend/webhook/redis-worker/pkg/scheduler/queue",
        "@com_github_alicebob_miniredis_v2//:miniredis",
    ],
)

check_pkg(name = "buildifier")
