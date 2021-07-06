load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@npm//@bazel/typescript:index.bzl", "ts_config")
load("//tools/lint:web.bzl", "web_lint")

package(default_visibility = ["//visibility:public"])

ts_config(
    name = "widget_tsconfig",
    src = "bazel.tsconfig.json",
    deps = ["//:bazel.tsconfig.json"],
)

check_pkg(name = "buildifier")

web_lint()
