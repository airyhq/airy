load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "model",
    deps = [
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//lodash-es",
    ],
)

check_pkg(name = "buildifier")

web_lint()
