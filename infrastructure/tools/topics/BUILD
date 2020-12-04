load("@rules_java//java:defs.bzl", "java_binary")

app_deps = [
    "//lib/java/kafka/schema:all-topics",
]

java_binary(
    name = "app",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.tools.topics.Application",
    resources = glob(["src/main/resources/**/*"]),
    deps = app_deps,
)
