load("@rules_java//java:defs.bzl", "java_library")
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
        "//apps/lib/kafka/core:kafka-core",
        "//apps/lib/kafka/schema:ops-application-health",
        "//apps/lib/spring/core:spring-core",
    ],
)
