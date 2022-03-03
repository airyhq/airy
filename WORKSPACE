workspace(
    name = "airy_core",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# Airy Bazel tools
git_repository(
    name = "com_github_airyhq_bazel_tools",
    commit = "f06cfde8e2a5bcdd4e1dbb78b756b3b9c011279b",
    remote = "https://github.com/airyhq/bazel-tools.git",
    shallow_since = "1644342255 +0100",
)

load("@com_github_airyhq_bazel_tools//:repositories.bzl", "airy_bazel_tools_dependencies", "airy_jvm_deps")

airy_bazel_tools_dependencies()

### Java tooling

load("@rules_jvm_external//:defs.bzl", "maven_install")
load("//:repositories.bzl", "excluded_artifacts", jvm_deps = "airy_jvm_deps")

maven_install(
    artifacts = airy_jvm_deps + jvm_deps,
    excluded_artifacts = excluded_artifacts,
    maven_install_json = "//:maven_install.json",
    repositories = [
        "https://packages.confluent.io/maven",
        "https://repo1.maven.org/maven2",
        "https://jitpack.io",
    ],
)

load("@maven//:defs.bzl", "pinned_maven_install")

pinned_maven_install()

### Golang tooling
# This needs to come before any rules_docker usage as it brings its own version of Gazelle
http_archive(
    name = "bazel_gazelle",
    sha256 = "62ca106be173579c0a167deb23358fdfe71ffa1e4cfdddf5582af26520f1c66f",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

load("@io_bazel_rules_go//extras:embed_data_deps.bzl", "go_embed_data_dependencies")

go_embed_data_dependencies()

go_register_toolchains(
    nogo = "@//:airy_nogo",
    version = "1.16",
)  # airy_nogo is in the top-level BUILD file of this workspace

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

gazelle_dependencies()

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
    sha256 = "59d5b42ac315e7eadffa944e86e90c2990110a1c8075f1cd145f487e999d22b3",
    strip_prefix = "rules_docker-0.17.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.17.0/rules_docker-v0.17.0.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

container_pull(
    name = "java_base",
    digest = "sha256:65aa73135827584754f1f1949c59c3e49f1fed6c35a918fadba8b4638ebc9c5d",
    registry = "gcr.io",
    repository = "distroless/java",
    tag = "11",
)

container_pull(
    name = "nginx_base",
    digest = "sha256:0340d329672fb3f0192754e4e1ccd7518ecc83f6644e8f0c317012bbc4d06d24",
    registry = "ghcr.io",
    repository = "airyhq/frontend/nginx-lua",
    tag = "1.0.0",
)

container_pull(
    name = "helm",
    digest = "sha256:722e4f1f4726d962eb87eb71b3935ff41c36574fd44e8740e8eabfbb693bb0d4",
    registry = "docker.io",
    repository = "alpine/helm",
    tag = "3.5.2",
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

### Helm rules

git_repository(
    name = "com_github_masmovil_bazel_rules",
    # tag = 0.5.0
    commit = "997510889b8c91b603bc265b68678d51ce396c41",
    remote = "https://github.com/masmovil/bazel-rules.git",
)

load(
    "@com_github_masmovil_bazel_rules//repositories:repositories.bzl",
    mm_repositories = "repositories",
)
mm_repositories()

### Bazel tooling

git_repository(
    name = "com_github_atlassian_bazel_tools",
    commit = "e45e55f213b6804115eed1b6eb4ffc3bcf7a0cc4",
    remote = "https://github.com/ash2k/bazel-tools.git",
    shallow_since = "1614900742 +1100",
)

load("@com_github_atlassian_bazel_tools//multirun:deps.bzl", "multirun_dependencies")

multirun_dependencies()

load("//:go_repositories.bzl", "go_repositories")

# gazelle:repository_macro go_repositories.bzl%go_repositories
go_repositories()

http_archive(
    name = "rules_pkg",
    sha256 = "038f1caa773a7e35b3663865ffb003169c6a71dc995e39bf4815792f385d837d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.4.0/rules_pkg-0.4.0.tar.gz",
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.4.0/rules_pkg-0.4.0.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()
