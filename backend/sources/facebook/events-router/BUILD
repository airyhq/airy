load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")

app_deps = [
    "//backend/avro/communication:channel",
    "//backend/avro/communication:message",
    "//backend/lib/uuid",
    "//backend/lib/payload",
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:source-facebook-events",
    "//backend/lib/kafka/schema:source-facebook-transformed-events",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
]

springboot(
    name = "events-router",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":app",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*IntegrationTest.java"])
]
