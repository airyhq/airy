load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "message",
    srcs = glob(["src/main/java/co/airy/model/message/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro/communication:message-avro",
        "//lib/java/kafka/schema:application-communication-messages",
    ],
    deps = [
        "//:lombok",
        "//lib/java/date",
        "//backend/avro/communication:message-avro",
    ],
)
