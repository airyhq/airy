load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "log",
    srcs = glob(["src/main/java/co/airy/log/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
    ],
    deps = [
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_core",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
    ],
)
