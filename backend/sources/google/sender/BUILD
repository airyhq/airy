load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//:lombok",
    "//:jackson",
    "//:springboot",
    "//backend/avro/communication:message",
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:application-communication-messages",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/streams:spring-kafka-streams",
    "@maven//:com_google_auth_google_auth_library_oauth2_http",
]

springboot(
    name = "google-sender",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

[
    junit5(
        size = "small",
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
    repository = "google-sender",
    tag = "latest",
)
