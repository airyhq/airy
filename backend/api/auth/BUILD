app_deps = [
    "//:lombok",
    "//:jdbi",
    "//backend/lib/payload",
    "//backend/lib/spring/web:spring-web",
    "//backend/lib/pagination",
    "@maven//:org_bouncycastle_bcpkix_jdk15on",
    "@maven//:org_flywaydb_flyway_core",
    "@maven//:org_postgresql_postgresql",
    "@maven//:org_springframework_boot_spring_boot_starter_data_jdbc",
    "@maven//:org_springframework_security_spring_security_crypto",
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
            "//backend/lib/spring/core:spring-test",
            "@maven//:io_zonky_test_embedded_database_spring_test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
