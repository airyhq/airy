load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")

app_deps = [
    "//backend/avro/communication:message",
    "//backend/avro/communication:channel",
    "//backend/avro/communication:metadata-action",
    "//backend/avro/communication:send-message-request",
    "//backend/lib/payload",
    "//backend/lib/pagination",
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/kafka/schema:application-communication-metadata",
    "//backend/lib/kafka/schema:source-facebook-send-message-requests",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
]

springboot(
    name = "api-conversations",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

java_library(
    name = "test-util",
    srcs = glob(["src/test/java/co/airy/core/api/conversations/util/**/*.java"]),
    deps = [":app"] + app_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":app",
            ":test-util",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
