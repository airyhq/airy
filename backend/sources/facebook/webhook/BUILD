load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

app_deps = [
    "//:lombok",
    "//:jackson",
    "//:springboot",
    "//backend/lib/spring/core:spring-core",
    "//backend/lib/kafka/schema:source-facebook-events",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/healthcheck",
]

springboot(
    name = "webhook",
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
            "//:springboot_test",
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
    repository = "facebook-webhook",
    tag = "latest",
)
