load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:helper.bzl", "file_to_kebab")

[
    custom_java_library(
        name = file_to_kebab(file),
        srcs = [file],
        visibility = ["//visibility:public"],
        exports = [
            ":kafka-schema",
        ],
        deps = [":kafka-schema"],
    )
    for file in glob(["src/main/java/co/airy/kafka/schema/**/*.java"])
]

custom_java_library(
    name = "kafka-schema",
    srcs = glob(["src/main/java/co/airy/kafka/schema/*.java"]),
    visibility = ["//visibility:public"],
)

custom_java_library(
    name = "all-topics",
    srcs = glob(["src/main/java/co/airy/kafka/schema/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [":kafka-schema"],
)
