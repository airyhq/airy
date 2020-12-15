load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_push.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//:springboot_websocket",
    "//backend:message",
    "//backend:channel",
    "//backend:metadata",
    "//backend:read-receipt",
    "//lib/java/mapping",
    "//lib/java/payload",
    "//lib/java/pagination",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "@maven//:org_springframework_security_spring_security_core",
    "@maven//:org_apache_lucene_lucene_queryparser",
    "@maven//:org_apache_lucene_lucene_analyzers_common",
    "@maven//:org_apache_lucene_lucene_core",
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
            "//backend:base_test",
            "//lib/java/kafka/test:kafka-test",
            "//lib/java/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    registry = "ghcr.io/airyhq/api",
    repository = "communication",
)
