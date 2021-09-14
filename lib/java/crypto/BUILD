load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "crypto",
    srcs = glob(["src/main/java/co/airy/crypto/**/*.java"]),
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
