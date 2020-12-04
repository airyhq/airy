load("//tools/build:java_library.bzl", "custom_java_library")
load("//tools/build:junit5.bzl", "junit5")

custom_java_library(
    name = "pagination",
    srcs = glob(["src/main/java/co/airy/pagination/**/*.java"]),
    visibility = ["//visibility:public"],
)

[
    junit5(
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":pagination",
            "//:junit",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
