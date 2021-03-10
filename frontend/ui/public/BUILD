load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "public",
    srcs = glob(
        ["**/*"],
    ),
)

check_pkg(name = "buildifier")

web_lint()
