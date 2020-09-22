load("//tools/build:avro.bzl", "avro_java_library")

avro_java_library(
    name = "healthcheck_schema",
    srcs = ["healtcheck.avsc"],
)

java_library(
    name = "healthcheck",
    srcs = glob(["**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        ":healthcheck_schema",
        "//backend/lib/kafka/core:kafka-core",
        "//backend/lib/kafka/schema:ops-application-health",
        "//backend/lib/spring/core:spring-core",
    ],
)
