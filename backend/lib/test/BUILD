load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "test",
    srcs = glob(["src/main/java/co/airy/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//backend/lib/log",
    ],
)
