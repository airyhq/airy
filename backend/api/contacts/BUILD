load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//backend/model/conversation",
    "//backend/model/metadata",
    "//backend/model/message",
    "//lib/java/uuid",
    "//lib/java/url",
    "//lib/java/pagination",
    "//lib/java/spring/web:spring-web",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/kafka/schema:application-communication-contacts",
    "//:springboot_actuator",
]

springboot(
    name = "contacts",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

test_deps = [
    ":app",
    "//backend:base_test",
    "//lib/java/kafka/test:kafka-test",
    "//lib/java/spring/test:spring-test",
] + app_deps

custom_java_library(
    name = "test-util",
    srcs = [
        "src/test/java/co/airy/core/contacts/util/TestContact.java",
        "src/test/java/co/airy/core/contacts/util/Topics.java",
    ],
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
    registry = "ghcr.io/airyhq/api",
    repository = "contacts",
)

check_pkg(name = "buildifier")
