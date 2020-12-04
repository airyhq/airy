load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_push.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "@maven//:com_twilio_sdk_twilio",
    "//lib/java/kafka/schema:source-twilio-events",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/healthcheck",
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
            "//backend:base_test",
            "@maven//:javax_xml_bind_jaxb_api",
            "//lib/java/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    registry = "ghcr.io/airyhq/sources",
    repository = "twilio-webhook",
)
