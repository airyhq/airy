load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-web",
    srcs = glob(["src/main/java/co/airy/spring/web/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:jwt",
        "//:lombok",
        "//:spring",
        "//lib/java/log",
        "//lib/java/spring/core:spring-core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_webmvc",
    ],
)
