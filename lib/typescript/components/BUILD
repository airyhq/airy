load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "components",
    deps = [
        "//lib/typescript/model",
        "//lib/typescript/types",
        "@npm//@crello/react-lottie",
        "@npm//@types/node",
        "@npm//@types/react",
        "@npm//@types/resize-observer-browser",
        "@npm//emoji-mart",
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-modal",
        "@npm//react-router-dom",
    ],
)

check_pkg(name = "buildifier")

web_lint()
