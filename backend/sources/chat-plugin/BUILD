load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//:jwt",
    "//:jackson",
    "//:lombok",
    "//:springboot",
    "//backend/avro/communication:channel",
    "//backend/avro/communication:message",
    "//backend/lib/uuid",
    "//backend/lib/payload",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
    "@maven//:org_springframework_boot_spring_boot_starter_security",
    "@maven//:org_springframework_boot_spring_boot_starter_websocket",
    "@maven//:org_springframework_security_spring_security_config",
    "@maven//:org_springframework_security_spring_security_core",
    "@maven//:org_springframework_security_spring_security_web",
    "@maven//:org_springframework_spring_messaging",
    "@maven//:org_springframework_spring_websocket",
    "@maven//:javax_xml_bind_jaxb_api",
]

springboot(
    name = "chat-plugin",
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
            "//backend/lib/test:test",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    name = "release",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/sources",
    repository = "chat-plugin",
    tag = "latest",
)
