load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")
# gazelle:prefix github.com/airyhq/airy/lib/go/config

go_library(
    name = "config",
    srcs = [
        "airy_yaml.go",
        "components.go",
        "kafka.go",
        "security.go",
    ],
    importpath = "github.com/airyhq/airy/lib/go/config",
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
