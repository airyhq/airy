load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//:springboot_actuator",
    "//:jdbi",
    "//lib/java/spring/auth:spring-auth",
    "//lib/java/spring/web:spring-web",
    "//lib/java/pagination",
    "@maven//:org_bouncycastle_bcpkix_jdk15on",
    "@maven//:org_flywaydb_flyway_core",
    "@maven//:org_postgresql_postgresql",
    "@maven//:org_springframework_boot_spring_boot_starter_data_jdbc",
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

container_release(
    registry = "ghcr.io/airyhq/api",
    repository = "auth",
)

check_pkg(name = "buildifier")
