load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-kafka-core",
    srcs = glob(["src/main/java/co/airy/spring/kafka/core/**/*.java"]),
    resources = ["src/main/resources/kafka-core.properties"],
    visibility = ["//visibility:public"],
    exports = [
        "//lib/java/kafka/core:kafka-core",
    ],
    deps = [
        "//:spring",
        "//lib/java/kafka/core:kafka-core",
        "//lib/java/spring/core:spring-core",
    ],
)

check_pkg(name = "buildifier")
