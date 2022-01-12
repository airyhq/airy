load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:avro.bzl", "avro_java_library")

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
    name = "source",
)

avro_java_library(
    name = "tag-avro",
    srcs = ["tag.avsc"],
)

avro_java_library(
    name = "template-avro",
    srcs = ["template.avsc"],
)

avro_java_library(name = "http-log")

avro_java_library(name = "user")

check_pkg(name = "buildifier")
