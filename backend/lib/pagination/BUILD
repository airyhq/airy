load("@rules_java//java:defs.bzl", "java_library")

java_library(
    name = "pagination-core",
    srcs = glob(["src/main/java/co/airy/pagination/**/*.java"]),
    visibility = ["//visibility:public"],
)

load("//tools/build:junit5.bzl", "junit5")

[
    junit5(
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":pagination-core",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
