load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "metadata",
    srcs = glob(["src/main/java/co/airy/model/metadata/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro/communication:metadata-avro",
        "//lib/java/kafka/schema:application-communication-metadata",
    ],
    deps = [
        "//:lombok",
        "//backend/avro/communication:metadata-avro",
        "//lib/java/uuid",
    ],
)
