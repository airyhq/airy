
java_library(
    name = "webhook",
    srcs = glob(["src/main/**/*"]),
    deps = [
        "//backend/lib/kafka/schema:kafka-schema",
        "//backend/lib/kafka/schema:source-facebook-events",
        "//backend/lib/spring/kafka/core:spring-kafka-core",
    ],
)
