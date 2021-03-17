load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")

package(default_visibility = ["//visibility:public"])

module_deps = [
    "//frontend/assets",
]

ts_web_library(
    name = "sharedServices",
    deps = module_deps + [
        "@npm//@types/react",
        "@npm//@types/react-dom",
        "@npm//react",
    ],
)

check_pkg(name = "buildifier")

web_lint()
