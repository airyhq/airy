load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@rules_java//java:defs.bzl", "java_library")

package(default_visibility = ["//visibility:public"])

java_library(
    name = "base_app",
    exports = [
        "//:jackson",
        "//:lombok",
        "//:spring",
        "//:springboot",
        "//lib/java/log",
        "//lib/java/spring/core:spring-core",
    ],
)

java_library(
    name = "base_test",
    exports = [
        "//:junit",
        "//:springboot_test",
        "//lib/java/test",
    ],
)

java_library(
    name = "read-receipt",
    exports = [
        "//backend/avro:read-receipt",
        "//lib/java/kafka/schema:application-communication-read-receipts",
    ],
)

java_library(
    name = "webhook",
    exports = [
        "//backend/avro:webhook",
        "//lib/java/kafka/schema:application-communication-webhooks",
    ],
)

check_pkg(name = "buildifier")
