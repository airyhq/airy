load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("//tools/build:springboot.bzl", "springboot")
load("//tools/build:junit5.bzl", "junit5")
load("//tools/build:container_release.bzl", "container_release")

app_deps = [
    "//backend:base_app",
    "//lib/java/spring/web:spring-web",
    "//:springboot_actuator",
    "//:k8s_client",
    "@maven//:org_eclipse_jgit_org_eclipse_jgit",
    "@maven//:org_springframework_retry_spring_retry",
    "@maven//:org_aspectj_aspectjweaver",
]

springboot(
    name = "contacts",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "co.airy.spring.core.AirySpringBootApplication",
    deps = app_deps,
)

[
    junit5(
        size = "medium",
        file = file,
        resources = glob(["src/test/resources/**/*"]),
        deps = [
            ":app",
            "//backend:base_test",
            "//lib/java/test",
            "//lib/java/spring/test:spring-test",
        ] + app_deps,
    )
    for file in glob(["src/test/java/**/*Test.java"])
]


container_release(
    registry = "ghcr.io/airyhq/api/components",
    repository = "installer",
)

check_pkg(name = "buildifier")
