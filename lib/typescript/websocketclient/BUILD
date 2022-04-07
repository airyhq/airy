load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "websocketclient",
    deps = [
        "//lib/typescript/model",
        "@npm//@stomp/stompjs",
        "@npm//@types/node",
        "@npm//camelcase-keys",
    ],
)

check_pkg(name = "buildifier")

web_lint()
