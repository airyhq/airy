load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = ["golden.go"],
    data = [
        "//infrastructure/cli/pkg/tests/golden/server:golden_files",
    ],
    importmap = "infrastructure/pkg/tests",
    importpath = "cli/pkg/tests",
    visibility = ["//visibility:public"],
    deps = ["@com_github_kr_pretty//:go_default_library"],
)
