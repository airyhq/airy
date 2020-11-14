load("@rules_java//java:defs.bzl", "java_library")

package(default_visibility = ["//visibility:public"])

java_library(
    name = "base_app",
    exports = [
        "//:jackson",
        "//:lombok",
        "//:spring",
        "//:springboot",
        "//backend/lib/log",
        "//backend/lib/spring/core:spring-core",
    ],
)

java_library(
    name = "base_test",
    exports = [
        "//:junit",
        "//:springboot_test",
        "//backend/lib/test",
    ],
)

java_library(
    name = "channel",
    exports = [
        "//backend/avro/communication:channel",
        "//backend/lib/kafka/schema:application-communication-channels",
    ],
)

java_library(
    name = "message",
    exports = [
        "//backend/avro/communication:message",
        "//backend/lib/kafka/schema:application-communication-messages",
    ],
)

java_library(
    name = "metadata",
    exports = [
        "//backend/avro/communication:metadata-action",
        "//backend/lib/kafka/schema:application-communication-metadata",
    ],
)

java_library(
    name = "read-receipt",
    exports = [
        "//backend/avro/communication:read-receipt",
        "//backend/lib/kafka/schema:application-communication-read-receipts",
    ],
)

java_library(
    name = "tag",
    exports = [
        "//backend/avro/communication:tag",
        "//backend/lib/kafka/schema:application-communication-tags",
    ],
)

java_library(
    name = "webhook",
    exports = [
        "//backend/avro/communication:webhook",
        "//backend/lib/kafka/schema:application-communication-webhooks",
    ],
)
