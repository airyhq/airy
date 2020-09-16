load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:junit5.bzl", "junit5")

lib_deps = [
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/core:kafka-core",
    "//:kafka_streams",
    "//backend/lib/log:log",
    "//:lombok",
    "@maven//:org_javatuples_javatuples",
    "@maven//:org_rocksdb_rocksdbjni",
]

java_library(
    name = "kafka-streams",
    srcs = glob([
        "src/main/java/co/airy/kafka/streams/**/*.java",
    ]),
    visibility = ["//visibility:public"],
    exports = [
        "//:kafka_streams",
        "@maven//:org_javatuples_javatuples",
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
            "//backend/lib/spring/kafka/streams:spring-kafka-streams",
            "//backend/lib/kafka/test:kafka-test",
        ] + lib_deps,
    )
    for file in glob(["src/test/java/**/*IntegrationTest.java"])
]
