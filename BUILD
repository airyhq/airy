load("@rules_java//java:defs.bzl", "java_library", "java_plugin")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@com_github_atlassian_bazel_tools//multirun:def.bzl", "multirun")
load("@bazel_gazelle//:def.bzl", "gazelle")

package(default_visibility = ["//visibility:public"])

multirun(
    name = "fix",
    commands = [
        "@com_github_airyhq_bazel_tools//code-format:fix_prettier",
        "@com_github_airyhq_bazel_tools//code-format:fix_buildifier",
    ],
    visibility = ["//visibility:public"],
)

container_image(
    name = "base_image",
    base = "@java_base//image",
)

java_library(
    name = "kafka_core",
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
    name = "jwt",
    exports = [
        "@maven//:io_jsonwebtoken_jjwt_api",
        "@maven//:io_jsonwebtoken_jjwt_impl",
        "@maven//:io_jsonwebtoken_jjwt_jackson",
    ],
)

java_library(
    name = "jdbi",
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
    deps = [
        "@maven//:org_projectlombok_lombok",
    ],
)

java_library(
    name = "spring",
    exports = [
        "@maven//:org_springframework_spring_beans",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_springframework_spring_core",
        "@maven//:org_springframework_spring_web",
    ],
)

java_library(
    name = "springboot",
    exports = [
        "@maven//:javax_servlet_javax_servlet_api",
        "@maven//:javax_validation_validation_api",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
        "@maven//:org_springframework_boot_spring_boot_loader",
        "@maven//:org_springframework_boot_spring_boot_starter",
        "@maven//:org_springframework_boot_spring_boot_starter_jetty",
        "@maven//:org_springframework_boot_spring_boot_starter_web",
    ],
)

java_library(
    name = "springboot_actuator",
    exports = [
        "@maven//:org_springframework_boot_spring_boot_actuator",
        "@maven//:org_springframework_boot_spring_boot_actuator_autoconfigure",
        "@maven//:org_springframework_boot_spring_boot_starter_actuator",
    ],
)

java_library(
    name = "junit",
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
    name = "springboot_websocket",
    exports = [
        "@maven//:org_springframework_boot_spring_boot_starter_websocket",
        "@maven//:org_springframework_spring_messaging",
        "@maven//:org_springframework_spring_websocket",
    ],
)

java_library(
    name = "springboot_security",
    exports = [
        "@maven//:org_springframework_boot_spring_boot_starter_security",
        "@maven//:org_springframework_security_spring_security_config",
        "@maven//:org_springframework_security_spring_security_core",
        "@maven//:org_springframework_security_spring_security_web",
    ],
)

java_library(
    name = "springboot_test",
    exports = [
        "@maven//:org_springframework_boot_spring_boot_starter_test",
        "@maven//:org_springframework_boot_spring_boot_test",
        "@maven//:org_springframework_boot_spring_boot_test_autoconfigure",
        "@maven//:org_springframework_spring_core",
        "@maven//:org_springframework_spring_test",
    ],
)

java_library(
    name = "jackson",
    exports = [
        "@maven//:com_fasterxml_jackson_core_jackson_annotations",
        "@maven//:com_fasterxml_jackson_core_jackson_core",
        "@maven//:com_fasterxml_jackson_core_jackson_databind",
    ],
)

exports_files(
    [
        "package.json",
        ".prettierrc.json",
        "yarn.lock",
        "tsconfig.json",
    ],
)

# gazelle:build_file_name BUILD
# gazelle:prefix
gazelle(name = "gazelle")
