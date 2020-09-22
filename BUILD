load("@rules_java//java:defs.bzl", "java_library", "java_plugin")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

alias(
    name = "check",
    actual = "//tools/code-format:check",
)

alias(
    name = "fix",
    actual = "//tools/code-format:fix",
)

container_image(
    name = "base_image",
    base = "@java_base//image",
    visibility = ["//visibility:public"],
)

java_library(
    name = "kafka_core",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:io_confluent_kafka_avro_serializer",
        "@maven//:io_confluent_kafka_schema_registry",
        "@maven//:io_confluent_kafka_schema_registry_client",
        "@maven//:io_confluent_kafka_streams_avro_serde",
        "@maven//:org_apache_avro_avro",
        "@maven//:org_apache_kafka_kafka_clients",
    ],
)

java_library(
    name = "kafka_streams",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:org_apache_kafka_kafka_streams",
        "@maven//:org_javatuples_javatuples",
    ],
)

java_library(
    name = "jwt",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:io_jsonwebtoken_jjwt_api",
        "@maven//:io_jsonwebtoken_jjwt_impl",
        "@maven//:io_jsonwebtoken_jjwt_jackson",
    ],
)

java_library(
    name = "lombok",
    exported_plugins = [
        ":lombok_plugin",
    ],
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:org_projectlombok_lombok",
    ],
    runtime_deps = [
        "@maven//:org_projectlombok_lombok",
    ],
)

java_plugin(
    name = "lombok_plugin",
    generates_api = True,
    processor_class = "lombok.launch.AnnotationProcessorHider$AnnotationProcessor",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "@maven//:org_projectlombok_lombok",
    ],
)

java_library(
    name = "jackson",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:com_fasterxml_jackson_core_jackson_annotations",
        "@maven//:com_fasterxml_jackson_core_jackson_core",
        "@maven//:com_fasterxml_jackson_core_jackson_databind",
    ],
)
