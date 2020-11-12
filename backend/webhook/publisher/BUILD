load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//backend:message",
    "//backend:webhook",
    "//backend/lib/uuid",
    "//backend/lib/payload",
    "//backend/lib/mapping",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
    "@maven//:io_lettuce_lettuce_core",
    "@maven//:org_springframework_data_spring_data_redis",
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
            "//backend:base_test",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    name = "release",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/webhook",
    repository = "publisher",
    tag = "release",
)

container_push(
    name = "develop",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/webhook",
    repository = "publisher",
    tag = "beta",
)
