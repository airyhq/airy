# gazelle:prefix api-client
# gazelle:importmap_prefix lib/go
load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importmap = "lib",
    importpath = "go/api-client",
    visibility = ["//visibility:private"],
    deps = [],
)

go_test(
    name = "go_default_test",
    srcs = ["main_test.go"],
    data = [
    ],
    embed = [":go_default_library"],
    deps = [
        "//lib/go/api-client/tests:go_default_library",
    ],
)