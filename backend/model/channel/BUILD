load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "channel",
    srcs = glob(["src/main/java/co/airy/model/channel/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro/communication:channel-avro",
        "//lib/java/kafka/schema:application-communication-channels",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro/communication:channel-avro",
        "//backend/model/metadata",
    ],
)

check_pkg(name = "buildifier")
