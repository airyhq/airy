load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-web",
    srcs = glob(["src/main/java/co/airy/spring/web/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/lib/spring/core:spring-core",
        "@maven//:javax_servlet_javax_servlet_api",
    ],
    deps = [
        "//:jwt",
        "//:lombok",
        "//:jackson",
        "//backend/lib/log",
        "//backend/lib/spring/core:spring-core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_spring_beans",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_webmvc",
    ],
)
