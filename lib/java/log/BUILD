load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "log",
    srcs = glob(["src/main/java/co/airy/log/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
        "@maven//:org_slf4j_slf4j_nop",
    ],
    deps = [
        "@maven//:org_apache_logging_log4j_log4j_api",
        "@maven//:org_apache_logging_log4j_log4j_core",
        "@maven//:org_apache_logging_log4j_log4j_slf4j_impl",
        "@maven//:org_slf4j_slf4j_api",
        "@maven//:org_slf4j_slf4j_nop",
    ],
)

check_pkg(name = "buildifier")
