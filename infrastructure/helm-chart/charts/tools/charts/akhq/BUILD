load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("@com_github_airyhq_bazel_tools//helm:helm.bzl", "helm_template_test")
load("//tools/build:helm.bzl", "helm_push_version")

filegroup(
    name = "files",
    srcs = glob(
        ["**/*"],
        exclude = ["BUILD"],
    ),
    visibility = ["//visibility:public"],
)

pkg_tar(
    name = "package",
    srcs = [":files"],
    extension = "tgz",
    strip_prefix = "./",
)

helm_template_test(
    name = "template",
    chart = ":package",
)

helm_push_version(
    chart = ":package",
    version = "0.16.0",
)
