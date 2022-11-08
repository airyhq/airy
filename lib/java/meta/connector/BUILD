load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

check_pkg(name = "buildifier")

custom_java_library(
    name = "sources-meta",
    srcs = glob(["src/main/java/co/airy/core/sources/meta/**/*.java"]),
    resources = glob(["src/main/resources/**/*"]),
    visibility = ["//visibility:public"],
    deps = [
        "//backend/model/channel",
        "//backend/model/message",
        "//backend/model/metadata",
        "//lib/java/log",
        "//lib/java/spring/kafka/core:spring-kafka-core",
        "//lib/java/spring/kafka/streams:spring-kafka-streams",
        "//lib/java/kafka/schema:source-facebook-events",
        "//lib/java/kafka/schema:source-instagram-events",
    ],
)
