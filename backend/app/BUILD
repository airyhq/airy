app_deps = [

]

load("//tools/build:springboot.bzl", "springboot")

springboot(
    name = "core",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.core.Main",
    deps = app_deps,
)

load("//tools/build:junit5.bzl", "junit5")

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

load("@io_bazel_rules_docker//container:container.bzl", "container_image")

container_image(
    name = "image",
    base = "//:base_image",
    files = [":genjar"],
    cmd = [
        "java",
        "-XshowSettings:vm",
        "-XX:MaxRAMPercentage=70",
        "-XX:-UseCompressedOops",
        "-jar",
        "app_springboot.jar",
        "-Dsun.net.inetaddr.ttl=0",
    ],
)

