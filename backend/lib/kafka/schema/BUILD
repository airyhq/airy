load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:helper.bzl", "file_to_kebab")

[
    java_library(
        name = file_to_kebab(file),
        srcs = [file],
        visibility = ["//visibility:public"],
        deps = [":kafka-schema"],
        exports = [
          ":kafka-schema"
        ]
    )
    for file in glob(["src/main/java/co/airy/kafka/schema/**/*.java"])
]

java_library(
    name = "kafka-schema",
    srcs = glob(["src/main/java/co/airy/kafka/schema/*.java"]),
    visibility = ["//visibility:public"],
)

java_library(
    name = "all-topics",
    srcs = glob(["src/main/java/co/airy/kafka/schema/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [":kafka-schema"],
)
