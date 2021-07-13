load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@rules_java//java:defs.bzl", "java_library")
load("//tools/build:junit5.bzl", "junit5")

# Due to a bug in the abbreviation checkstyle rule
# we need to skip style checking on this lib
java_library(
    name = "uuid",
    srcs = glob(["src/main/java/co/airy/uuid/**/*.java"]),
    visibility = ["//visibility:public"],
)

[
    junit5(
        file = file,
        deps = [
            ":uuid",
            "//:junit",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

check_pkg(name = "buildifier")
