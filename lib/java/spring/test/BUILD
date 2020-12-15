load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-test",
    srcs = glob(["src/main/java/co/airy/spring/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//:spring",
        "//:springboot_test",
        "//lib/java/log",
        "//lib/java/spring/jwt:airy-jwt",
        "//lib/java/test",
    ],
)
