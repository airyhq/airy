load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "render",
    deps = [
        "//lib/typescript/assets",
        "//lib/typescript/dates",
        "//lib/typescript/model",
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//@types/react",
        "@npm//@types/resize-observer-browser",
        "@npm//linkify-react",
        "@npm//linkifyjs",
        "@npm//react",
        "@npm//react-markdown",
    ],
)

check_pkg(name = "buildifier")

web_lint()
