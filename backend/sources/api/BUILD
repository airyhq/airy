load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//:jwt",
    "//backend/model/channel",
    "//backend/model/message",
    "//lib/java/uuid",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "@maven//:javax_xml_bind_jaxb_api",
]

springboot(
    name = "api",
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
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_release(
    registry = "ghcr.io/airyhq/sources",
    repository = "api",
)

check_pkg(name = "buildifier")
