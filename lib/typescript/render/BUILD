load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "render",
    deps = [
        "//frontend/assets",
        "//lib/typescript/dates",
        "//lib/typescript/httpclient",
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//@types/react",
        "@npm//@types/resize-observer-browser",
        "@npm//linkifyjs",
        "@npm//react",
    ],
)
