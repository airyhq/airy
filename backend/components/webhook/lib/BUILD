load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "lib",
    srcs = glob(["src/main/java/co/airy/core/webhook/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro:webhook",
        "//backend/model/event",
        "//lib/java/kafka/schema:application-communication-channels",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro:webhook",
        "//backend/model/event",
    ],
)

check_pkg(name = "buildifier")
