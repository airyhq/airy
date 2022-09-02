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
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/uuid",
    "//lib/java/tracking",
    "//lib/java/kafka/schema:source-google-events",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/auth:spring-auth",
    "@maven//:com_google_auth_google_auth_library_oauth2_http",
]

springboot(
    name = "google-connector",
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
            "//lib/java/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/sources",
    repository = "google-connector",
)

check_pkg(name = "buildifier")
