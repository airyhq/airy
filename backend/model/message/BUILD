load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "message",
    srcs = glob(["src/main/java/co/airy/model/message/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro:message-avro",
        "//lib/java/kafka/schema:application-communication-messages",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro:message-avro",
        "//backend/model/metadata",
        "//lib/java/date",
    ],
)

check_pkg(name = "buildifier")
