workspace(
    name = "airy_core",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# Airy Bazel tools
git_repository(
    name = "com_github_airyhq_bazel_tools",
    commit = "779a58fee479db0a738da6f1de1adec3ff0acf0c",
    remote = "https://github.com/airyhq/bazel-tools.git",
    shallow_since = "1654761067 +0200",
)

load("@com_github_airyhq_bazel_tools//:repositories.bzl", "airy_bazel_tools_dependencies", "airy_jvm_deps")

airy_bazel_tools_dependencies()

### Java tooling

load("@rules_jvm_external//:defs.bzl", "maven_install")
load("//:repositories.bzl", "excluded_artifacts", jvm_deps = "airy_jvm_deps")

maven_install(
    artifacts = airy_jvm_deps + jvm_deps,
    excluded_artifacts = excluded_artifacts,
    fail_if_repin_required = True,
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

http_archive(
    name = "zlib",
    build_file = "@com_google_protobuf//:third_party/zlib.BUILD",
    sha256 = "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1",
    strip_prefix = "zlib-1.2.11",
    urls = [
        "https://mirror.bazel.build/zlib.net/zlib-1.2.11.tar.gz",
        "https://zlib.net/zlib-1.2.11.tar.gz",
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

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

## Docker containers

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "59536e6ae64359b716ba9c46c39183403b01eabfbd57578e84398b4829ca499a",
    strip_prefix = "rules_docker-0.22.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.22.0/rules_docker-v0.22.0.tar.gz"],
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
load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories()

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

### Bazel tooling

git_repository(
    name = "com_github_ash2k_bazel_tools",
    commit = "aefb11464b6b83590e4154a98c29171092ca290f",
    remote = "https://github.com/ash2k/bazel-tools.git",
    shallow_since = "1644872739 +1100",
)

load("@com_github_ash2k_bazel_tools//multirun:deps.bzl", "multirun_dependencies")

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

### Helm
load("@com_github_airyhq_bazel_tools//helm:helm.bzl", "helm_tool")

helm_tool(
    name = "helm_binary",
)
