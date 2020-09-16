app_deps = [
    "//backend/avro/communication:channel",
    "//backend/avro/communication:message",
    "//backend/avro/communication:conversation",
    "//backend/avro/communication:conversation-state",
    "//backend/sources/facebook/avro:facebook-transformed-event-key",
    "//backend/lib/uuid",
    "//backend/lib/payload",
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:source-facebook-events",
    "//backend/lib/kafka/schema:source-facebook-transformed-events",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/kafka/schema:application-communication-conversations",
    "//backend/lib/kafka/schema:application-communication-conversation-states",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
]

load("//tools/build:springboot.bzl", "springboot")

springboot(
    name = "messages-upserter",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)
