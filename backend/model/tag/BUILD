load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "tag",
    srcs = glob(["src/main/java/co/airy/model/tag/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro/communication:tag-avro",
        "//lib/java/kafka/schema:application-communication-tags",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro/communication:tag-avro",
    ],
)

check_pkg(name = "buildifier")
