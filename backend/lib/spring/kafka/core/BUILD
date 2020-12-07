load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-kafka-core",
    srcs = glob(["src/main/java/co/airy/spring/kafka/core/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/lib/kafka/core:kafka-core",
    ],
    deps = [
        "//:spring",
        "//backend/lib/kafka/core:kafka-core",
        "//backend/lib/spring/core:spring-core",
    ],
)
