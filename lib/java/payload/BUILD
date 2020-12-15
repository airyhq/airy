load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "payload",
    srcs = glob(["src/main/java/co/airy/payload/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
    ],
)
