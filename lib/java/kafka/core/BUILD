load("//tools/build:java_library.bzl", "custom_java_library")

custom_java_library(
    name = "kafka-core",
    srcs = glob([
        "src/main/java/co/airy/kafka/core/**/*.java",
        "src/main/java/io/confluent/kafka/**/*.java",
    ]),
    visibility = ["//visibility:public"],
    exports = [
        "//:kafka_core",
    ],
    deps = [
        "//:jackson",
        "//:kafka_core",
        "//lib/java/log",
        "@maven//:com_fasterxml_jackson_module_jackson_module_afterburner",
    ],
)
