load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-kafka-streams",
    srcs = glob(["src/main/java/co/airy/spring/kafka/streams/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/lib/kafka/streams:kafka-streams",
    ],
    deps = [
        "//:spring",
        "//backend/lib/kafka/core:kafka-core",
        "//backend/lib/kafka/streams:kafka-streams",
        "//backend/lib/spring/core:spring-core",
    ],
)
