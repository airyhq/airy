load("@rules_java//java:defs.bzl", "java_library")

# Due to a bug in the abbreviation checkstyle rule
# we need to skip style checking on this lib
java_library(
    name = "uuid",
    srcs = glob(["src/main/java/co/airy/uuid/**/*.java"]),
    visibility = ["//visibility:public"],
)
