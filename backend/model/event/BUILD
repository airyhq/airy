load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "event",
    srcs = glob(["src/main/java/co/airy/model/event/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/model/channel",
        "//backend/model/conversation",
        "//backend/model/message",
        "//backend/model/metadata",
        "//backend/model/tag",
    ],
)

check_pkg(name = "buildifier")
