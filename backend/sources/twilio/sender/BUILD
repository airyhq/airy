load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_push.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//backend:channel",
    "//backend:message",
    "//lib/java/log",
    "//lib/java/mapping",
    "@maven//:com_twilio_sdk_twilio",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
]

springboot(
    name = "sender",
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
            "//backend:base_test",
            "//lib/java/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    registry = "ghcr.io/airyhq/sources",
    repository = "twilio-sender",
)
