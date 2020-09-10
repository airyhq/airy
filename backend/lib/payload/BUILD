load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "payload-core",
    srcs = glob(["src/main/java/co/airy/payload/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//apps/avro-schemas/communication:channel",
        "//apps/avro-schemas/communication:contact-v1",
        "//apps/avro-schemas/communication:content-record",
        "//apps/avro-schemas/communication:message",
        "//apps/avro-schemas/communication:message-container",
        "//apps/lib/log",
        "@maven//:javax_validation_validation_api",
        "@maven//:org_javatuples_javatuples",
    ],
)
