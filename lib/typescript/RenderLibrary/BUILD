load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "renderLibrary",
    deps = [
        "//lib/typescript/httpclient",
        "//lib/typescript/services",
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//linkifyjs",
        "@npm//react",
    ],
)
