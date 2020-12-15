load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:junit5.bzl", "junit5")

lib_deps = [
    "@maven//:org_apache_kafka_kafka_streams",
    "//lib/java/kafka/schema:kafka-schema",
    "//lib/java/kafka/core:kafka-core",
    "//lib/java/log",
    "//:lombok",
    "@maven//:org_rocksdb_rocksdbjni",
]

custom_java_library(
    name = "kafka-streams",
    srcs = glob([
        "src/main/java/co/airy/kafka/streams/**/*.java",
    ]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_apache_kafka_kafka_streams",
    ],
    deps = lib_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":kafka-streams",
            "//lib/java/spring/kafka/streams:spring-kafka-streams",
            "//lib/java/kafka/test:kafka-test",
        ] + lib_deps,
    )
    for file in glob(["src/test/java/**/*IntegrationTest.java"])
]
