load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

app_deps = [
    "//:spring",
    "//:springboot",
    "//:springboot_actuator",
    "//:jackson",
    "//:lombok",
    "//backend/model/message",
    "//lib/java/log",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/core:spring-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//backend/model/metadata",
    "@maven//:commons_codec_commons_codec",
]

springboot(
    name = "rasa-connector",
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
            "@com_github_airyhq_airy_dev//backend:base_test",
            "@com_github_airyhq_airy_dev//lib/java/test",
            "@com_github_airyhq_airy_dev//lib/java/kafka/test:kafka-test",
            "@com_github_airyhq_airy_dev//lib/java/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/connectors",
    repository = "rasa-connector",
)