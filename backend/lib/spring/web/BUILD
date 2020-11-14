load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-web",
    srcs = glob(["src/main/java/co/airy/spring/web/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:spring",
        "//:jackson",
        "//:jwt",
        "//:lombok",
        "//backend/lib/log",
        "//backend/lib/spring/core:spring-core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_webmvc",
    ],
)
