load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "websocketclient",
    deps = [
        "//lib/typescript/httpclient",
        "//lib/typescript/types",
        "@npm//@stomp/stompjs",
        "@npm//@types/node",
    ],
)

check_pkg(name = "buildifier")
