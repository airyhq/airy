load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//backend/avro:source",
    "//backend/model/channel",
    "//backend/model/message",
    "//backend/model/conversation",
    "//backend/model/metadata",
    "//lib/java/crypto",
    "//lib/java/date",
    "//lib/java/uuid",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/kafka/schema:application-communication-sources",
    "//:springboot_actuator",
    "@maven//:javax_xml_bind_jaxb_api",
]

springboot(
    name = "api",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

test_deps = app_deps + [
    ":app",
    "//backend:base_test",
    "//lib/java/kafka/test:kafka-test",
    "//lib/java/spring/test:spring-test",
]

custom_java_library(
    name = "test-util",
    srcs = glob(["src/test/java/co/airy/core/sources/api/util/**/*.java"]),
    deps = test_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = test_deps + [":test-util"],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/sources",
    repository = "api",
)

check_pkg(name = "buildifier")
