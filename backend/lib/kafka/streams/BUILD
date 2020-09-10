load("@rules_java//java:defs.bzl", "java_library")

lib_deps = [
    "//apps/lib/kafka/schema:kafka-schema",
    "//apps/lib/kafka/core:kafka-core",
    "//:kafka_streams",
    "//apps/lib/log:log",
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

load("//tools/build:junit5.bzl", "junit5")

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":kafka-streams",
            "//apps/lib/spring/kafka/streams:spring-kafka-streams",
            "//apps/lib/kafka/test:kafka-test",
        ] + lib_deps,
    )
    for file in glob(["src/test/java/**/*IntegrationTest.java"])
]
