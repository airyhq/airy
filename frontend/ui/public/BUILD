load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "public",
    srcs = glob(
        ["**/*"],
    ),
)

check_pkg(name = "buildifier")
