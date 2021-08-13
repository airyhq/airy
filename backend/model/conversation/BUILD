load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "conversation",
    srcs = glob(["src/main/java/co/airy/model/conversation/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/model/channel",
        "//backend/model/message",
        "//backend/model/metadata",
        "//lib/java/date",
        "//lib/java/text",
    ],
)

check_pkg(name = "buildifier")
