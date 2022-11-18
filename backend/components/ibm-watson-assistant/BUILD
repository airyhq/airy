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
    "//backend/model/metadata",
    "//:feign",
    "//lib/java/log",
    "//lib/java/sources-parser",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/core:spring-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/spring/async:spring-async",
]

springboot(
    name = "ibm-watson-assistant-connector",
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
            "//lib/java/test",
            "//lib/java/kafka/test:kafka-test",
            "//lib/java/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/connectors",
    repository = "ibm-watson-assistant-connector",
)
