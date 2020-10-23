load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-auth",
    srcs = glob(["src/main/java/co/airy/spring/auth/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "//backend/lib/log",
    ],
    deps = [
        "//:jackson",
        "//:jwt",
        "//backend/lib/log",
        "//backend/lib/spring/core:spring-core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_boot_spring_boot_starter_security",
        "@maven//:org_springframework_security_spring_security_config",
        "@maven//:org_springframework_security_spring_security_core",
        "@maven//:org_springframework_security_spring_security_web",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_context_support",
        "@maven//:org_springframework_spring_web",
    ],
)
