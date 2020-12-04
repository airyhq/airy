load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_push.bzl", "container_push")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

ts_library(
    name = "app",
    deps = [
        "//lib/typescript/types",
        "@npm//@airyhq/components",
        "@npm//@types/facebook-js-sdk",
        "@npm//@types/node",
        "@npm//@types/prop-types",
        "@npm//@types/react",
        "@npm//@types/react-redux",
        "@npm//emoji-mart",
        "@npm//lodash-es",
        "@npm//react",
        "@npm//react-facebook-login",
        "@npm//react-router-dom",
        "@npm//redux",
        "@npm//redux-starter-kit",
        "@npm//typesafe-actions",
    ],
)

web_app(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/demo/src/index.js",
    index = ":index.html",
    static_assets = "//frontend/demo/public",
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

container_push(
    registry = "ghcr.io/airyhq/frontend",
    repository = "demo",
)
