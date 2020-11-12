load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-core",
    srcs = glob(["src/main/java/co/airy/spring/core/**/*.java"]),
    resources = glob(["src/main/resources/**/*"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//backend/lib/log",
        "@maven//:com_fasterxml_jackson_core_jackson_databind",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_validation_validation_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_aspectj_aspectjweaver",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
        "@maven//:org_springframework_spring_aop",
        "@maven//:org_springframework_spring_beans",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_context_support",
    ],
)
