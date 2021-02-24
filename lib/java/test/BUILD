load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "test",
    srcs = glob(["src/main/java/co/airy/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//lib/java/log",
    ],
)

check_pkg(name = "buildifier")
