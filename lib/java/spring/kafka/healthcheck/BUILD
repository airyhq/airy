load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:avro.bzl", "avro_java_library")

avro_java_library(
    name = "healthcheck_schema",
    srcs = ["healtcheck.avsc"],
)

custom_java_library(
    name = "healthcheck",
    srcs = glob(["**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        ":healthcheck_schema",
        "//lib/java/kafka/core:kafka-core",
        "//lib/java/kafka/schema:ops-application-health",
        "@maven//:org_springframework_spring_context",
    ],
)
