load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "cmd",
    srcs = ["root.go"],
    importpath = "cli/cmd",
    visibility = ["//visibility:public"],
    x_defs = {
        "Version": "{STABLE_VERSION}",
        "CommitSHA1": "{STABLE_GIT_COMMIT}",
    },
    deps = [
        "//infrastructure/cli/cmd/api",
        "//infrastructure/cli/cmd/config",
        "//infrastructure/cli/cmd/create",
        "//infrastructure/cli/cmd/status",
        "//infrastructure/cli/cmd/ui",
        "@com_github_mitchellh_go_homedir//:go-homedir",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
    ],
)

check_pkg(name = "buildifier")
