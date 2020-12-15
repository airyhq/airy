load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_push.bzl", "container_push")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//:jdbi",
    "//lib/java/payload",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/spring/web:spring-web",
    "//lib/java/pagination",
    "@maven//:org_bouncycastle_bcpkix_jdk15on",
    "@maven//:org_flywaydb_flyway_core",
    "@maven//:org_postgresql_postgresql",
    "@maven//:org_springframework_boot_spring_boot_starter_data_jdbc",
    "@maven//:org_springframework_boot_spring_boot_starter_mail",
    "@maven//:org_springframework_security_spring_security_crypto",
    "@maven//:org_springframework_spring_context_support",
    "@maven//:org_springframework_spring_jdbc",
    "@maven//:org_springframework_spring_tx",
]

springboot(
    name = "api-auth",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        deps = [
            ":app",
            "//backend:base_test",
            "//lib/java/spring/test:spring-test",
            "@maven//:io_zonky_test_embedded_database_spring_test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

container_push(
    registry = "ghcr.io/airyhq/api",
    repository = "auth",
)
