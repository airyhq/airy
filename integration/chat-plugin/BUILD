load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

ts_web_library(
    name = "specs",
    srcs = glob(["*.spec.ts"]),
    deps = [
        "//frontend/chat-plugin/handles:chat-plugin-handles",
        "@npm//cypress",
    ],
)

filegroup(
    name = "specs_output",
    srcs = [":specs"],
    output_group = "es5_sources",
    visibility = ["//integration:__pkg__"],
)
