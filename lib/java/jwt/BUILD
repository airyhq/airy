load("@rules_java//java:defs.bzl", "java_library")

lib_deps = [
    "//:jackson",
    "//:jwt",
    "//:lombok",
    "//:spring",
    "//:springboot_security",
    "//lib/java/log",
    "//lib/java/spring/core:spring-core",
    "@maven//:javax_servlet_javax_servlet_api",
    "@maven//:javax_xml_bind_jaxb_api",
]

java_library(
    name = "airy-jwt",
    srcs = glob(["src/main/java/co/airy/jwt/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = lib_deps,
)
