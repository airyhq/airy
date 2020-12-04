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
    name = "channel",
    exports = [
        "//backend/avro/communication:channel",
        "//lib/java/kafka/schema:application-communication-channels",
    ],
)

java_library(
    name = "message",
    exports = [
        "//backend/avro/communication:message",
        "//lib/java/kafka/schema:application-communication-messages",
    ],
)

java_library(
    name = "metadata",
    exports = [
        "//backend/avro/communication:metadata-action",
        "//lib/java/kafka/schema:application-communication-metadata",
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
