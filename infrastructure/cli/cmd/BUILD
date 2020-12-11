load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "cmd",
    srcs = [
        "root.go",
        "version.go",
    ],
    importmap = "infrastructure/cmd",
    importpath = "cli/cmd",
    visibility = ["//visibility:public"],
    x_defs = {
        "CLIVersion": "{STABLE_VERSION}",
        "GitCommit": "{STABLE_GIT_COMMIT}",
    },
    deps = [
        "//infrastructure/cli/cmd/auth",
        "//infrastructure/cli/cmd/bootstrap",
        "//infrastructure/cli/cmd/config",
        "//infrastructure/cli/cmd/demo",
        "@com_github_spf13_cobra//:cobra",
    ],
)
