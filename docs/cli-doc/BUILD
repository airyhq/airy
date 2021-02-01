# gazelle:prefix docs
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

go_library(
    name = "generate_cli_docs_lib",
    srcs = ["generate_cli_docs.go"],
    importpath = "docs",
    visibility = ["//visibility:private"],
    x_defs = {
        "ProjectDir": "{PROJECT_DIR}",
    },
    deps = [
        "//infrastructure/cli/cmd",
        "@com_github_spf13_cobra//doc",
    ],
)

go_binary(
    name = "generate_cli_docs",
    out = "generate_cli_docs",
    embed = [":generate_cli_docs_lib"],
    visibility = ["//visibility:public"],
)
