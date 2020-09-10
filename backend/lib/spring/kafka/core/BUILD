load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-kafka-core",
    srcs = glob(["src/main/java/co/airy/spring/kafka/core/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//apps/lib/kafka/core:kafka-core",
        "//apps/lib/spring/core:spring-core",
    ],
    deps = [
        "//apps/lib/kafka/core:kafka-core",
        "//apps/lib/spring/core:spring-core",
    ],
)
