load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "spring-core",
    srcs = glob(["src/main/java/co/airy/spring/core/**/*.java"]),
    resources = glob(["src/main/resources/**/*"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:spring",
        "//backend/lib/log",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
    ],
)
