load("@rules_java//java:defs.bzl", "java_library")

java_library(
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
        "@maven//:javax_validation_validation_api",
    ],
)
