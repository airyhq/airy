load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "kafka-connect",
    srcs = glob([
        "src/main/java/co/airy/kafka/connect/**/*.java",
    ]),
    visibility = ["//visibility:public"],
    deps = [
        "@maven//:org_apache_kafka_connect_api",
        "@maven//:org_apache_kafka_connect_transforms",
        "@maven//:org_apache_kafka_kafka_clients",
    ],
)
