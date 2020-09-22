load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "log",
    srcs = glob(["src/main/java/co/airy/log/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
    ],
    deps = [
        "//:jackson",
        "@maven//:org_apache_kafka_kafka_clients",
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_core",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
    ],
)
