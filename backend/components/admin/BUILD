load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//backend/model/channel",
    "//backend/model/tag",
    "//backend:webhook",
    "//backend/model/metadata",
    "//backend/model/template",
    "//backend/model/event",
    "//lib/java/uuid",
    "//lib/java/pagination",
    "//lib/java/date",
    "//backend/avro:http-log",
    "//backend/avro:user",
    "//lib/java/kafka/schema:ops-application-logs",
    "//lib/java/kafka/schema:application-communication-users",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/tracking:tracking",
    "@maven//:org_springframework_retry_spring_retry",
]

springboot(
    name = "api-admin",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

custom_java_library(
    name = "test-util",
    srcs = ["src/test/java/co/airy/core/admin/util/Topics.java"],
    deps = app_deps,
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

container_release(
    registry = "ghcr.io/airyhq/api",
    repository = "admin",
)

check_pkg(name = "buildifier")
