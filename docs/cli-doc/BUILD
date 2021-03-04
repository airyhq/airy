load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

# gazelle:prefix docs
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

go_library(
    name = "generate_cli_docs_lib",
    srcs = [
        "generate_cli_docs.go",
        "util.go",
    ],
    importpath = "docs",
    visibility = ["//visibility:private"],
    x_defs = {
        "ProjectDir": "{PROJECT_DIR}",
    },
    deps = ["@com_github_spf13_cobra//:cobra"],
)

go_binary(
    name = "generate_cli_docs",
    out = "generate_cli_docs",
    embed = [":generate_cli_docs_lib"],
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
