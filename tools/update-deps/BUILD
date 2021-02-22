# gazelle:prefix github.com/airyhq/airy/tools/update-deps
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")

go_library(
    name = "update-deps_lib",
    srcs = [
        "main.go",
        "modules.go",
    ],
    importpath = "github.com/airyhq/airy/tools/update-deps",
    visibility = ["//visibility:private"],
    deps = ["@org_golang_x_mod//modfile:go_default_library"],
)

go_binary(
    name = "update-deps",
    out = "update-deps",
    embed = [":update-deps_lib"],
    visibility = ["//visibility:public"],
)
