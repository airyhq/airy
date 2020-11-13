load("@rules_java//java:defs.bzl", "java_library")

lib_deps = [
    "//:jackson",
    "//:jwt",
    "//:lombok",
    "//:springboot_security",
    "//backend/lib/log",
    "//backend/lib/spring/core:spring-core",
    "@maven//:javax_servlet_javax_servlet_api",
    "@maven//:javax_xml_bind_jaxb_api",
    "@maven//:org_springframework_spring_beans",
    "@maven//:org_springframework_spring_context",
    "@maven//:org_springframework_spring_context_support",
    "@maven//:org_springframework_spring_web",
]

java_library(
    name = "spring-auth",
    srcs = glob(["src/main/java/co/airy/spring/auth/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_springframework_security_spring_security_core",
    ],
    deps = lib_deps,
)

java_library(
    name = "test-app",
    srcs = ["src/test/java/co/airy/spring/auth/TestApp.java"],
    deps = lib_deps,
)

load("//tools/build:junit5.bzl", "junit5")

[
    junit5(
        file = file,
        deps = lib_deps + [
            ":test-app",
            "@maven//:org_springframework_spring_webmvc",
            "@maven//:org_springframework_boot_spring_boot_starter_jetty",
            ":spring-auth",
            "//:springboot_test",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
