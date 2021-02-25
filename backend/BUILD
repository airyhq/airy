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
        "//backend/avro/communication:read-receipt",
        "//lib/java/kafka/schema:application-communication-read-receipts",
    ],
)

java_library(
    name = "tag",
    exports = [
        "//backend/avro/communication:tag",
        "//lib/java/kafka/schema:application-communication-tags",
    ],
)

java_library(
    name = "webhook",
    exports = [
        "//backend/avro/communication:webhook",
        "//lib/java/kafka/schema:application-communication-webhooks",
    ],
)

check_pkg(name = "buildifier")
