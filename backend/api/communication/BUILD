load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//:lombok",
    "//:jackson",
    "//:springboot",
    "//backend/lib/spring/auth:spring-auth",
    "//backend/avro/communication:message",
    "//backend/avro/communication:channel",
    "//backend/avro/communication:metadata-action",
    "//backend/avro/communication:read-receipt",
    "//backend/lib/mapping",
    "//backend/lib/payload",
    "//backend/lib/log",
    "//backend/lib/pagination",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/kafka/schema:application-communication-metadata",
    "//backend/lib/kafka/schema:application-communication-read-receipts",
    "//backend/lib/spring/core:spring-core",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
    "@maven//:org_springframework_boot_spring_boot_starter_websocket",
    "@maven//:org_springframework_spring_messaging",
    "@maven//:org_springframework_spring_websocket",
    "@maven//:org_springframework_security_spring_security_core",
]

springboot(
    name = "api-communication",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

java_library(
    name = "test-util",
    srcs = glob(["src/test/java/co/airy/core/api/communication/util/**/*.java"]),
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
            "//:springboot_test",
            "//backend/lib/test:test",
            "//backend/lib/kafka/test:kafka-test",
            "//backend/lib/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    name = "release",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/api",
    repository = "communication",
    tag = "latest",
)
