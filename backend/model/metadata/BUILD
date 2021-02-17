load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:junit5.bzl", "junit5")

lib_deps = [
    "//:lombok",
    "//:jackson",
    "//backend/avro/communication:metadata-avro",
    "//lib/java/log",
    "//lib/java/uuid",
]

custom_java_library(
    name = "metadata",
    srcs = glob(["src/main/java/co/airy/model/metadata/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro/communication:metadata-avro",
        "//lib/java/kafka/schema:application-communication-metadata",
    ],
    deps = lib_deps,
)

junit5(
    size = "medium",
    file = "src/test/java/co/airy/model/metadata/ObjectMapperTest.java",
    deps = [
        ":metadata",
        "//:junit",
    ] + lib_deps,
)
