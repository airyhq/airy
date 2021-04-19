load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "spring-events",
    srcs = glob(["src/main/java/co/airy/spring/events/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:jackson",
        "//:lombok",
        "//:spring",
        "//backend/avro:http-log",
        "//lib/java/kafka/schema:ops-application-logs",
        "//lib/java/spring/core:spring-core",
        "//lib/java/spring/kafka/core:spring-kafka-core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_xml_bind_jaxb_api",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_webmvc",
    ],
)

check_pkg(name = "buildifier")
