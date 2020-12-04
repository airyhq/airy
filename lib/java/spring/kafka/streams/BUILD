load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-kafka-streams",
    srcs = glob(["src/main/java/co/airy/spring/kafka/streams/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//lib/java/kafka/streams:kafka-streams",
    ],
    deps = [
        "//:spring",
        "//lib/java/kafka/core:kafka-core",
        "//lib/java/kafka/streams:kafka-streams",
        "//lib/java/spring/core:spring-core",
    ],
)
