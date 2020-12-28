load("//tools/build:avro.bzl", "avro_java_library")
load("//tools/build:java_library.bzl", "custom_java_library")

package(default_visibility = ["//visibility:public"])

avro_java_library(
    name = "channel-avro",
    srcs = ["channel.avsc"],
)

avro_java_library(
    name = "webhook",
)

avro_java_library(
    name = "read-receipt",
)

avro_java_library(
    name = "message-avro",
    srcs = ["message.avsc"],
)

avro_java_library(
    name = "metadata-avro",
    srcs = ["metadata.avsc"],
)

avro_java_library(
    name = "tag",
)
