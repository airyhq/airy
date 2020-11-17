load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//:jwt",
    "//:springboot_actuator",
    "//:springboot_websocket",
    "//:springboot_security",
    "//backend:channel",
    "//backend:message",
    "//backend/lib/uuid",
    "//backend/lib/payload",
    "//backend/lib/mapping",
    "//backend/lib/spring/web:spring-web",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
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
            "//backend:base_test",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    name = "latest",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/sources",
    repository = "chat-plugin",
    tag = "latest",
)

container_push(
    name = "beta",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/sources",
    repository = "chat-plugin",
    tag = "beta",
)
