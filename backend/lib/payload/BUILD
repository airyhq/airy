load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "payload-core",
    srcs = glob(["src/main/java/co/airy/payload/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//backend/avro/communication:message",
        "//backend/lib/log",
        "@maven//:javax_validation_validation_api",
        "@maven//:org_javatuples_javatuples",
    ],
)
