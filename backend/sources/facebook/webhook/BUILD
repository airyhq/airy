load("//tools/build:springboot.bzl", "springboot")

app_deps = [
    "//backend/lib/kafka/schema:kafka-schema",
    "//backend/lib/kafka/schema:source-facebook-events",
    "//backend/lib/spring/kafka/core:spring-kafka-core",
    "//backend/lib/spring/kafka/healthcheck",
]

springboot(
    name = "webhook",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)
