workspace(
    name = "airy_core",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# Airy Bazel tools

git_repository(
    name = "com_github_airyhq_bazel_tools",
    commit = "fd79bd3344b9c95a09eaa94597a49069f943e089",
    remote = "https://github.com/airyhq/bazel-tools.git",
    shallow_since = "1607079534 +0100",
)

load("@com_github_airyhq_bazel_tools//:repositories.bzl", "airy_bazel_tools_dependencies", "airy_jvm_deps")

airy_bazel_tools_dependencies()

### Java tooling

load("@rules_jvm_external//:defs.bzl", "maven_install")

maven_install(
    artifacts = airy_jvm_deps + [
        "com.fasterxml.jackson.core:jackson-annotations:2.10.0",
        "com.fasterxml.jackson.core:jackson-core:2.10.0",
        "com.fasterxml.jackson.core:jackson-databind:2.10.0",
        "com.fasterxml.jackson.module:jackson-module-afterburner:2.10.0",
        "com.google.auth:google-auth-library-oauth2-http:0.20.0",
        "com.jayway.jsonpath:json-path:2.4.0",
        "com.twilio.sdk:twilio:7.51.0",
        "cz.habarta.typescript-generator:typescript-generator-core:2.26.723",
        "io.confluent:kafka-avro-serializer:5.5.1",
        "io.confluent:kafka-schema-registry-client:5.5.1",
        "io.confluent:kafka-schema-registry:5.5.1",
        "io.confluent:kafka-streams-avro-serde:5.5.1",
        "io.jsonwebtoken:jjwt-api:0.10.5",
        "io.jsonwebtoken:jjwt-impl:0.10.5",
        "io.jsonwebtoken:jjwt-jackson:0.10.5",
        "io.lettuce:lettuce-core:5.3.3.RELEASE",
        "io.zonky.test:embedded-database-spring-test:1.5.1",
        "javax.activation:javax.activation-api:1.2.0",
        "javax.validation:validation-api:2.0.1.Final",
        "javax.xml.bind:jaxb-api:2.3.1",
        "org.apache.logging.log4j:log4j-core:2.12.1",
        "org.apache.logging.log4j:log4j-slf4j-impl:2.12.1",
        "org.slf4j:slf4j-api:1.7.29",
        "org.apache.avro:avro-tools:1.10.0",
        "org.apache.avro:avro:1.10.0",
        "org.apache.curator:curator-test:4.2.0",
        "org.apache.kafka:connect-api:2.5.1",
        "org.apache.kafka:connect-transforms:2.5.1",
        "org.apache.kafka:kafka-clients:2.5.1",
        "org.apache.kafka:kafka-clients:jar:test:2.5.1",
        "org.apache.kafka:kafka-streams:2.5.1",
        "org.apache.kafka:kafka_2.12:2.5.1",
        "org.apache.lucene:lucene-queryparser:8.7.0",
        "org.apache.lucene:lucene-analyzers-common:8.7.0",
        "org.apache.lucene:lucene-core:8.7.0",
        "org.bouncycastle:bcpkix-jdk15on:1.63",
        "org.flywaydb:flyway-core:5.2.4",
        "org.hamcrest:hamcrest-library:2.1",
        "org.hamcrest:hamcrest:2.1",
        "org.junit.jupiter:junit-jupiter-engine:5.7.0",
        "org.junit.jupiter:junit-jupiter:5.7.0",
        "org.junit.platform:junit-platform-console:1.7.0",
        "org.junit.platform:junit-platform-engine:1.7.0",
        "org.jdbi:jdbi3-core:3.14.4",
        "org.jdbi:jdbi3-postgres:3.14.4",
        "org.jdbi:jdbi3-sqlobject:3.14.4",
        "org.jdbi:jdbi3-spring4:3.14.4",
        "org.mockito:mockito-core:2.28.2",
        "org.postgresql:postgresql:42.2.5",
        "org.projectlombok:lombok:1.18.10",
        "org.springframework.boot:spring-boot-loader:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-actuator:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-data-jdbc:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-jetty:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-test:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-mail:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-web:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-websocket:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-security:2.3.1.RELEASE",
        "org.springframework:spring-aop:4.1.4.RELEASE",
        "org.springframework:spring-jdbc:4.1.4.RELEASE",
        "org.springframework:spring-context-support:5.2.0.RELEASE",
        "org.springframework:spring-context:5.2.0.RELEASE",
        "org.springframework:spring-messaging:5.1.2.RELEASE",
        "org.springframework:spring-websocket:5.1.2.RELEASE",
        "org.springframework.data:spring-data-redis:2.3.3.RELEASE",
        "org.springframework.security:spring-security-core:5.1.2.RELEASE",
        "org.springframework.security:spring-security-crypto:5.3.0.RELEASE",
        "org.rocksdb:rocksdbjni:5.18.3",
    ],
    excluded_artifacts = [
        "ch.qos.logback:logback-classic",
        "org.springframework.boot:spring-boot-starter-tomcat",
        "org.springframework.boot:spring-boot-starter-logging",
        "org.slf4j:slf4j-log4j12",
    ],
    maven_install_json = "//:maven_install.json",
    repositories = [
        "https://packages.confluent.io/maven",
        "https://oss.sonatype.org/content/repositories/snapshots/",
        "https://repo1.maven.org/maven2",
        "https://jitpack.io",
    ],
)

load("@maven//:defs.bzl", "pinned_maven_install")

pinned_maven_install()

### Golang tooling

# This needs to come before any rules_docker usage as it brings its own version of Gazelle

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()

git_repository(
    name = "com_google_protobuf",
    commit = "09745575a923640154bcf307fba8aedff47f240a",
    remote = "https://github.com/protocolbuffers/protobuf",
    shallow_since = "1558721209 -0700",
)

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

## Docker containers

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "4521794f0fba2e20f3bf15846ab5e01d5332e587e9ce81629c7f96c793bb7036",
    strip_prefix = "rules_docker-0.14.4",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.14.4/rules_docker-v0.14.4.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//repositories:pip_repositories.bzl", "pip_deps")

pip_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

container_pull(
    name = "java_base",
    digest = "sha256:9f080b14f9d2c42b7a753169daf5ee7f6c0cbaa36d51ab4390a132941df0b111",
    registry = "index.docker.io",
    repository = "library/openjdk",
    tag = "11.0.3-jre-slim",
)

container_pull(
    name = "nginx_base",
    digest = "sha256:662a0c5a8677063c27b0ddd42f1c801be643b9502f7b1a4e2e727cb2bc3808a8",
    registry = "index.docker.io",
    repository = "nginx",
    tag = "stable-alpine",
)

load(
    "@io_bazel_rules_docker//go:image.bzl",
    _go_image_repos = "repositories",
)

_go_image_repos()

### Frontend build tooling

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories()

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

### Bazel tooling

git_repository(
    name = "com_github_atlassian_bazel_tools",
    commit = "dc5e715035b6b17f24f1d40a7eac08f8f2ac8a11",
    remote = "https://github.com/atlassian/bazel-tools.git",
    shallow_since = "1597268988 +1000",
)

load("@com_github_atlassian_bazel_tools//multirun:deps.bzl", "multirun_dependencies")

multirun_dependencies()

load("//:go_repositories.bzl", "go_repositories")

# gazelle:repository_macro go_repositories.bzl%go_repositories
go_repositories()

http_archive(
    name = "rules_pkg",
    sha256 = "352c090cc3d3f9a6b4e676cf42a6047c16824959b438895a76c2989c6d7c246a",
    url = "https://github.com/bazelbuild/rules_pkg/releases/download/0.2.5/rules_pkg-0.2.5.tar.gz",
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()
