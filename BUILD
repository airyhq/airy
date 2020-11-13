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
    name = "jdbi",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:org_jdbi_jdbi3_core",
        "@maven//:org_jdbi_jdbi3_postgres",
        "@maven//:org_jdbi_jdbi3_spring4",
        "@maven//:org_jdbi_jdbi3_sqlobject",
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
    name = "springboot",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_validation_validation_api",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_actuator",
        "@maven//:org_springframework_boot_spring_boot_actuator_autoconfigure",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
        "@maven//:org_springframework_boot_spring_boot_loader",
        "@maven//:org_springframework_boot_spring_boot_starter",
        "@maven//:org_springframework_boot_spring_boot_starter_actuator",
        "@maven//:org_springframework_boot_spring_boot_starter_jetty",
        "@maven//:org_springframework_boot_spring_boot_starter_web",
        "@maven//:org_springframework_spring_beans",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_core",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_webmvc",
    ],
)

java_library(
    name = "junit",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        "@maven//:com_jayway_jsonpath_json_path",
        "@maven//:org_hamcrest_hamcrest",
        "@maven//:org_hamcrest_hamcrest_library",
        "@maven//:org_junit_jupiter_junit_jupiter",
        "@maven//:org_junit_jupiter_junit_jupiter_api",
        "@maven//:org_junit_jupiter_junit_jupiter_engine",
        "@maven//:org_junit_jupiter_junit_jupiter_params",
        "@maven//:org_mockito_mockito_core",
    ],
)

java_library(
    name = "springboot_test",
    visibility = [
        "//visibility:public",
    ],
    exports = [
        ":junit",
        "@maven//:org_springframework_boot_spring_boot_starter_test",
        "@maven//:org_springframework_boot_spring_boot_test",
        "@maven//:org_springframework_boot_spring_boot_test_autoconfigure",
        "@maven//:org_springframework_spring_core",
        "@maven//:org_springframework_spring_test",
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

exports_files(
    [
        "package.json",
        "yarn.lock",
        "tsconfig.json",
    ],
    visibility = ["//visibility:public"],
)
