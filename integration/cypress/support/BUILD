load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "support",
    srcs = ["index.ts", "commands.ts"],
    deps = [
        "@npm//cypress",
    ]
)
