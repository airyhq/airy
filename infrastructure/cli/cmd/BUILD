load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = [
        "root.go",
        "version.go",
    ],
    importmap = "infrastructure/cmd",
    importpath = "cli/cmd",
    visibility = ["//visibility:public"],
    deps = [
        "//infrastructure/cli/cmd/auth:go_default_library",
        "//infrastructure/cli/cmd/bootstrap:go_default_library",
        "//infrastructure/cli/cmd/config:go_default_library",
        "@com_github_spf13_cobra//:go_default_library",
    ],
    x_defs = {"CLIVersion": "{STABLE_VERSION}", "GitCommit": "{STABLE_GIT_COMMIT}"},
)
