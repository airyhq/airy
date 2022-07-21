load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

# gazelle:prefix github.com/airyhq/airy/tools/update-deps
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

go_library(
    name = "update-deps_lib",
    srcs = [
        "main.go",
        "modules.go",
    ],
    importpath = "github.com/airyhq/airy/tools/update-deps",
    visibility = ["//visibility:private"],
    deps = [
        "@org_golang_x_mod//modfile",
        "@org_golang_x_mod//semver",
    ],
)

go_binary(
    name = "update-deps",
    out = "update-deps",
    embed = [":update-deps_lib"],
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
