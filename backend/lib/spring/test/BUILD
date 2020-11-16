load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-test",
    srcs = glob(["src/main/java/co/airy/spring/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//:spring",
        "//:springboot_test",
        "//backend/lib/log",
        "//backend/lib/spring/auth:spring-auth",
        "//backend/lib/test",
    ],
)
