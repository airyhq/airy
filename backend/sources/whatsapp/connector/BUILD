load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//backend/model/channel",
    "//backend/model/message",
    "//backend/model/metadata",
    "//lib/java/uuid",
    "//lib/java/log",
    "//lib/java/tracking",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/kafka/schema:source-whatsapp-events",
]

springboot(
    name = "connector",
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
            "//lib/java/kafka/test:kafka-test",
            "//lib/java/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/sources",
    repository = "whatsapp-connector",
)

check_pkg(name = "buildifier")
