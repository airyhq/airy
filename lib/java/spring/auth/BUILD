load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:junit5.bzl", "junit5")

lib_deps = [
    "//:jackson",
    "//:jwt",
    "//:lombok",
    "//:spring",
    "//:springboot_security",
    "//lib/java/log",
    "//lib/java/spring/core:spring-core",
    "@maven//:javax_servlet_javax_servlet_api",
    "@maven//:org_springframework_security_spring_security_core",
    "@maven//:org_springframework_boot_spring_boot",
    "@maven//:org_springframework_security_spring_security_oauth2_client",
    "@maven//:org_springframework_boot_spring_boot_autoconfigure",
    "@maven//:javax_xml_bind_jaxb_api",
]

custom_java_library(
    name = "spring-auth",
    srcs = glob(["src/main/java/co/airy/spring/auth/**/*.java"]),
    visibility = ["//visibility:public"],
    exports = [
        "@maven//:org_springframework_security_spring_security_core",
        "@maven//:org_springframework_security_spring_security_oauth2_core",
    ],
    deps = lib_deps,
)

custom_java_library(
    name = "test-app",
    srcs = glob(["src/test/java/co/airy/spring/auth/test_app/*.java"]),
    deps = [":spring-auth"] + lib_deps,
)

[
    junit5(
        file = file,
        deps = lib_deps + [
            ":test-app",
            "@maven//:org_springframework_spring_webmvc",
            "@maven//:org_springframework_boot_spring_boot_starter_jetty",
            ":spring-auth",
            "//backend:base_test",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

check_pkg(name = "buildifier")
