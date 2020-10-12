load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//backend/avro/communication:channel",
    "//backend/lib/payload",
    "//backend/lib/uuid",
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:application-communication-channels",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
]

springboot(
    name = "api-admin",
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
    for file in glob(["src/test/java/**/*Test.java"])
]


container_push(
    name = "release-prod",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/pascal-airy/api-admin",
    repository = "api-admin",
    tag = "latest",
)