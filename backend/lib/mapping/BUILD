load("@rules_java//java:defs.bzl", "java_binary", "java_library")
load("//tools/build:junit5.bzl", "junit5")

lib_deps = [
    "//:lombok",
    "//:spring",
    "//:jackson",
    "//backend/lib/log",
    "//backend/avro/communication:message",
    "@maven//:com_fasterxml_jackson_core_jackson_databind",
    "@maven//:javax_validation_validation_api",
]

java_library(
    name = "mapping",
    srcs = glob(["src/main/java/co/airy/mapping/**/*.java"]),
    visibility = ["//visibility:public"],
    deps = lib_deps,
)

java_binary(
    name = "ts-generator",
    srcs = glob(["src/ts-generator/**/*.java"]),
    main_class = "co.airy.ts_generator.Main",
    deps = [
        ":mapping",
        "@maven//:cz_habarta_typescript_generator_typescript_generator_core",
    ],
)

[
    junit5(
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = lib_deps + [
            ":mapping",
            "//backend:base_test",
            "//backend/lib/spring/core:spring-core",
        ],
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
