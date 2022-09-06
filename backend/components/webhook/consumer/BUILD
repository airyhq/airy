load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//backend/components/webhook/lib",
    "//backend/model/message",
    "//backend/model/metadata",
    "//backend:webhook",
    "//lib/java/uuid",
    "//lib/java/date",
    "//lib/java/crypto",
    "//lib/java/spring/kafka/core:spring-kafka-core",
    "//lib/java/spring/kafka/streams:spring-kafka-streams",
    "//lib/java/spring/web:spring-web",
    "@maven//:com_dinstone_beanstalkc",
    "//:springboot_actuator",
]

springboot(
    name = "webhook-consumer",
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
    registry = "ghcr.io/airyhq/webhook",
    repository = "consumer",
)

check_pkg(name = "buildifier")
