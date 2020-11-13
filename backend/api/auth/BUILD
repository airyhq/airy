app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//:jdbi",
    "//backend/lib/payload",
    "//backend/lib/spring/auth:spring-auth",
    "//backend/lib/spring/web:spring-web",
    "//backend/lib/pagination",
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

load("//tools/build:springboot.bzl", "springboot")

springboot(
    name = "api-auth",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

load("//tools/build:junit5.bzl", "junit5")

[
    junit5(
        size = "medium",
        file = file,
        deps = [
            ":app",
            "//backend:base_test",
            "//backend/lib/spring/test:spring-test",
            "@maven//:io_zonky_test_embedded_database_spring_test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]

load("@io_bazel_rules_docker//container:container.bzl", "container_push")

container_push(
    name = "latest",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/api",
    repository = "auth",
    tag = "latest",
)

container_push(
    name = "beta",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/api",
    repository = "auth",
    tag = "beta",
)
