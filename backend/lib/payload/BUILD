load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "payload",
    srcs = glob(["src/main/java/co/airy/payload/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "@maven//:javax_validation_validation_api",
    ],
)
