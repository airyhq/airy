load("@io_bazel_rules_go//go:def.bzl", "go_library")

package(default_visibility = ["//visibility:public"])

go_library(
    name = "tests",
    srcs = [
        "golden.go",
        "mockserver.go",
    ],
    importmap = "infrastructure/pkg/tests",
    importpath = "cli/pkg/tests",
    deps = [
        "@com_github_kr_pretty//:pretty",
        "@io_goji//:goji.io",
        "@io_goji//pat",
    ],
)
