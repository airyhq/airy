load("//tools/build:avro.bzl", "avro_java_library")
load("//tools/build:java_library.bzl", "custom_java_library")

package(default_visibility = ["//visibility:public"])

avro_java_library(
    name = "channel",
)

avro_java_library(
    name = "message",
)

avro_java_library(
    name = "webhook",
)

avro_java_library(
    name = "read-receipt",
)

custom_java_library(
    name = "metadata-action",
    srcs = glob(["metadata-action/src/main/**/*.java"]),
    exports = [":metadata-action-avro"],
    deps = [":metadata-action-avro"],
)

avro_java_library(
    name = "metadata-action-avro",
    srcs = ["metadata-action.avsc"],
    visibility = ["//visibility:private"],
)

avro_java_library(
    name = "tag",
)
