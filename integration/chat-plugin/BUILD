load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

ts_web_library(
    name = "specs",
    srcs = glob(["*.spec.ts"]),
    deps = [
        "//frontend/chat-plugin:handles",
        "@npm//cypress",
    ],
)

filegroup(
    name = "specs_output",
    srcs = [":specs"],
    output_group = "es5_sources",
    visibility = ["//integration:__pkg__"],
)
