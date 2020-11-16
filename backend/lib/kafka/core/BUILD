load("@rules_java//java:defs.bzl", "java_library")

java_library(
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
        "//backend/lib/log",
        "@maven//:com_fasterxml_jackson_module_jackson_module_afterburner",
    ],
)
