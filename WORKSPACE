workspace(
    name = "airy_core",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

http_archive(
    name = "bazel_skylib",
    sha256 = "1c531376ac7e5a180e0237938a2536de0c54d93f5c278634818e0efc952dd56c",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

### Java tooling

RULES_JVM_EXTERNAL_TAG = "3.2"

RULES_JVM_EXTERNAL_SHA = "82262ff4223c5fda6fb7ff8bd63db8131b51b413d26eb49e3131037e79e324af"

http_archive(
    name = "rules_jvm_external",
    sha256 = RULES_JVM_EXTERNAL_SHA,
    strip_prefix = "rules_jvm_external-%s" % RULES_JVM_EXTERNAL_TAG,
    url = "https://github.com/bazelbuild/rules_jvm_external/archive/%s.zip" % RULES_JVM_EXTERNAL_TAG,
)

load("@rules_jvm_external//:defs.bzl", "maven_install")

maven_install(
    artifacts = [
        "com.fasterxml.jackson.core:jackson-annotations:2.10.0",
        "com.fasterxml.jackson.core:jackson-core:2.10.0",
        "com.fasterxml.jackson.core:jackson-databind:2.10.0",
        "com.fasterxml.jackson.module:jackson-module-afterburner:2.10.0",
        "com.jayway.jsonpath:json-path:2.4.0",
        "io.confluent:kafka-avro-serializer:5.5.1",
        "io.confluent:kafka-schema-registry-client:5.5.1",
        "io.confluent:kafka-schema-registry:5.5.1",
        "io.confluent:kafka-streams-avro-serde:5.5.1",
        "io.jsonwebtoken:jjwt-api:0.10.5",
        "io.jsonwebtoken:jjwt-impl:0.10.5",
        "io.jsonwebtoken:jjwt-jackson:0.10.5",
        "io.zonky.test:embedded-database-spring-test:1.5.1",
        "javax.activation:javax.activation-api:1.2.0",
        "javax.validation:validation-api:2.0.1.Final",
        "javax.xml.bind:jaxb-api:2.3.1",
        "org.apache.logging.log4j:log4j-core:2.12.1",
        "org.apache.logging.log4j:log4j-slf4j-impl:2.12.1",
        "org.slf4j:slf4j-api:1.7.29",
        "org.apache.avro:avro-tools:1.9.1",
        "org.apache.avro:avro:1.9.1",
        "org.apache.curator:curator-test:4.2.0",
        "org.apache.kafka:connect-api:2.5.1",
        "org.apache.kafka:connect-transforms:2.5.1",
        "org.apache.kafka:kafka-clients:2.5.1",
        "org.apache.kafka:kafka-clients:jar:test:2.5.1",
        "org.apache.kafka:kafka-streams:2.5.1",
        "org.apache.kafka:kafka_2.12:2.5.1",
        "org.aspectj:aspectjweaver:1.8.10",
        "org.flywaydb:flyway-core:5.2.4",
        "org.hamcrest:hamcrest-library:2.1",
        "org.hamcrest:hamcrest:2.1",
        "org.javatuples:javatuples:1.2",
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
        "org.springframework.boot:spring-boot-starter-data-jpa:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-jetty:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-test:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-web:2.3.1.RELEASE",
        "org.springframework.boot:spring-boot-starter-websocket:2.3.1.RELEASE",
        "org.springframework.retry:spring-retry:1.2.4.RELEASE",
        "org.springframework:spring-aop:4.1.4.RELEASE",
        "org.springframework:spring-jdbc:4.1.4.RELEASE",
        "org.springframework:spring-context-support:5.2.0.RELEASE",
        "org.springframework:spring-context:5.2.0.RELEASE",
        "org.springframework:spring-messaging:5.1.2.RELEASE",
        "org.springframework:spring-websocket:5.1.2.RELEASE",
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

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "a8d6b1b354d371a646d2f7927319974e0f9e52f73a2452d2b3877118169eb6bb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.23.3/rules_go-v0.23.3.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.23.3/rules_go-v0.23.3.tar.gz",
    ],
)

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

### Frontend build tooling

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "f9e7b9f42ae202cc2d2ce6d698ccb49a9f7f7ea572a78fd451696d03ef2ee116",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.6.0/rules_nodejs-1.6.0.tar.gz"],
)

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

### Bazel tools

http_archive(
    name = "com_github_bazelbuild_buildtools",
    strip_prefix = "buildtools-master",
    url = "https://github.com/bazelbuild/buildtools/archive/master.zip",
)

git_repository(
    name = "com_github_atlassian_bazel_tools",
    commit = "dc5e715035b6b17f24f1d40a7eac08f8f2ac8a11",
    remote = "https://github.com/atlassian/bazel-tools.git",
)

load("@com_github_atlassian_bazel_tools//multirun:deps.bzl", "multirun_dependencies")

multirun_dependencies()
