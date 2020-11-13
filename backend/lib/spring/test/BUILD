load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-test",
    srcs = glob(["src/main/java/co/airy/spring/test/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//:springboot_test",
        "//backend/lib/log",
        "//backend/lib/spring/auth:spring-auth",
        "//backend/lib/test",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_validation_validation_api",
        "@maven//:org_eclipse_jetty_jetty_server",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_context_support",
        "@maven//:org_springframework_spring_core",
        "@maven//:org_springframework_spring_web",
    ],
)
