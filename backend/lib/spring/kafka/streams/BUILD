load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-kafka-streams",
    srcs = glob(["src/main/java/co/airy/spring/kafka/streams/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//apps/lib/kafka/streams:kafka-streams",
        "//apps/lib/spring/core:spring-core",
    ],
    deps = [
        "//apps/lib/kafka/core:kafka-core",
        "//apps/lib/kafka/streams:kafka-streams",
        "//apps/lib/spring/core:spring-core",
    ],
)
