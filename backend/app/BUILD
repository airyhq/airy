load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")

app_deps = [
]

springboot(
    name = "core",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.core.Main",
    deps = app_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":app",
            "//backend/lib/kafka/test:kafka-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]
