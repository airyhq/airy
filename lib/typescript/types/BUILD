load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_declaration_import")

package(default_visibility = ["//visibility:public"])

ts_declaration_import(
    name = "types",
)

check_pkg(name = "buildifier")

web_lint()
