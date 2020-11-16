load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "kafka-test",
    srcs = glob(["src/main/java/co/airy/kafka/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend:base_test",
        "//backend/lib/kafka/core:kafka-core",
        "//backend/lib/kafka/schema:kafka-schema",
        "//backend/lib/log",
        "@maven//:org_apache_curator_curator_test",
        "@maven//:org_apache_kafka_kafka_2_12",
        "@maven//:org_apache_kafka_kafka_clients_test",
        "@maven//:org_apache_kafka_kafka_streams",
        "@maven//:org_eclipse_jetty_jetty_server",
    ],
)
