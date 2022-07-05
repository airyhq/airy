load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "workspace",
    srcs = [
        "files.go",
        "init.go",
    ],
    importpath = "cli/pkg/workspace",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/workspace/template",
        "//lib/go/config",
        "@com_github_hashicorp_go_getter//:go-getter",
        "@com_github_spf13_viper//:viper",
        "@in_gopkg_yaml_v2//:yaml_v2",
    ],
)
