load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "workspace",
    srcs = [
        "airy_yaml.go",
        "files.go",
        "init.go",
    ],
    importpath = "cli/pkg/workspace",
    visibility = ["//visibility:public"],
    deps = [
        "//cli/pkg/workspace/template",
        "@com_github_spf13_viper//:viper",
        "@in_gopkg_yaml_v2//:yaml_v2",
    ],
)
