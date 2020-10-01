load("//tools/build:avro.bzl", "avro_java_library")
load("@rules_java//java:defs.bzl", "java_library")

package(default_visibility = ["//visibility:public"])

avro_java_library(
    name = "channel-connect-request",
)

avro_java_library(
    name = "channel",
)

avro_java_library(
    name = "available-channels-request",
)

avro_java_library(
    name = "available-channels-response",
)

avro_java_library(
    name = "message",
)

avro_java_library(
    name = "conversation",
)

avro_java_library(
    name = "contact",
)

avro_java_library(
    name = "send-message-request",
    srcs = [
        "contact.avsc",
        "message.avsc",
        "send-message-request.avsc",
    ],
)

java_library(
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
