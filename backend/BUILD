load("@rules_java//java:defs.bzl", "java_library")

package(default_visibility = ["//visibility:public"])

java_library(
    name = "base_app",
    exports = [
        "//:jackson",
        "//:lombok",
        "//:springboot",
        "//backend/lib/log",
        "//backend/lib/spring/core:spring-core",
    ],
)
