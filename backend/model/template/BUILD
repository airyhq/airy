load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "template",
    srcs = glob(["src/main/java/co/airy/model/template/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro:template-avro",
        "//lib/java/kafka/schema:application-communication-templates",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro:template-avro",
        "//backend/model/metadata",
    ],
)

check_pkg(name = "buildifier")
