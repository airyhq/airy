load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "queue",
    srcs = ["queue.go"],
    importpath = "redis-worker/pkg/scheduler/queue",
    visibility = ["//visibility:public"],
    deps = ["@com_github_go_redis_redis_v8//:redis"],
)

check_pkg(name = "buildifier")
