load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "cmd",
    srcs = ["root.go"],
    importmap = "infrastructure/cmd",
    importpath = "cli/cmd",
    visibility = ["//visibility:public"],
    x_defs = {
        "Version": "{STABLE_VERSION}",
        "CommitSHA1": "{STABLE_GIT_COMMIT}",
    },
    deps = [
        "//infrastructure/cli/cmd/auth",
        "//infrastructure/cli/cmd/config",
        "//infrastructure/cli/cmd/ui",
        "@com_github_mitchellh_go_homedir//:go-homedir",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)
