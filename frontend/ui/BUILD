load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_release.bzl", "container_release")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

module_deps = [
    "//lib/typescript/assets",
    "//lib/typescript/components",
    "//lib/typescript/types",
    "//lib/typescript/model",
    "//lib/typescript/httpclient",
    "//lib/typescript/render",
    "//lib/typescript/dates",
    "//lib/typescript/websocketclient",
    "//frontend/ui/handles",
    "//frontend/chat-plugin/handles:chat-plugin-handles",
    "//frontend/chat-plugin/lib:chat-plugin",
]

ts_web_library(
    name = "app",
    deps = module_deps + [
        "@npm//@types/node",
        "@npm//@types/react",
        "@npm//@types/react-dom",
        "@npm//@types/react-redux",
        "@npm//lodash-es",
        "@npm//react",
        "@npm//react-router-dom",
        "@npm//redux",
        "@npm//@reduxjs/toolkit",
        "@npm//reselect",
        "@npm//typesafe-actions",
        "@npm//camelcase-keys",
        "@npm//react-color",
    ],
)

web_app(
    name = "bundle",
    app_lib = ":app",
    dev_index = "development.html",
    entry = "frontend/ui/src/index",
    index = ":index.html",
    module_deps = module_deps,
    output = {
        "publicPath": "/ui",
    },
    static_assets = "//frontend/ui/public",
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
    repository = "ui",
)

web_lint()
