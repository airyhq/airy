load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "tracking",
    srcs = glob(["src/main/java/co/airy/tracking/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = [
        "//:lombok",
        "//:spring",
        "//lib/java/log",
        "@maven//:com_segment_analytics_java_analytics",
        "@maven//:com_segment_analytics_java_analytics_core",
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
    ],
)

check_pkg(name = "buildifier")
