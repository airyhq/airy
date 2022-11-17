load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "component",
    srcs = glob(["src/main/java/co/airy/model/component/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/model/metadata",
        "//lib/java/log",
    ],
)

check_pkg(name = "buildifier")
