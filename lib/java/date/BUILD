load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "date",
    srcs = glob(["src/main/java/co/airy/date/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
    ],
)

check_pkg(name = "buildifier")
