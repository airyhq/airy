load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "note",
    srcs = glob(["src/main/java/co/airy/model/note/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/avro:note-avro",
        "//lib/java/kafka/schema:application-communication-notes",
    ],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro:note-avro",
    ],
)

check_pkg(name = "buildifier")
