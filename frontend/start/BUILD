load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_release.bzl", "container_release")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

web_app(
    name = "bundle",
    dev_index = "index.html",
    entry = "frontend/start/src/index",
    index = ":index.html",
    output = {
        "publicPath": "/",
    },
    static_assets = "//frontend/start/public",
)

pkg_tar(
    name = "bundle_tar",
    srcs = [":bundle"],
    package_dir = "/usr/share/nginx/html/",
    strip_prefix = "./bundle",
)

pkg_tar(
    name = "conf_tar",
    srcs = [":nginx.conf"],
    package_dir = "/etc/nginx",
)

container_image(
    name = "image",
    base = "@nginx_base//image",
    tars = [
        ":bundle_tar",
        ":conf_tar",
    ],
    visibility = ["//visibility:public"],
)

container_release(
    registry = "ghcr.io/airyhq/frontend",
    repository = "start",
)

web_lint()
