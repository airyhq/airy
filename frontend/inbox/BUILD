load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_release.bzl", "container_release")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

ts_deps = [
    "//lib/typescript/assets",
    "//lib/typescript/components",
    "//lib/typescript/types",
    "//lib/typescript/model",
    "//lib/typescript/httpclient",
    "//lib/typescript/render",
    "//lib/typescript/dates",
    "//lib/typescript/translations",
    "//lib/typescript/websocketclient",
    "//frontend/inbox/handles",
    "//frontend/chat-plugin/handles:chat-plugin-handles",
    "//frontend/chat-plugin/lib:chat-plugin",
]

ts_web_library(
    name = "app",
    deps = ts_deps + [
        "@npm//@types/node",
        "@npm//@types/lodash-es",
        "@npm//@types/dom-mediacapture-record",
        "@npm//lodash-es",
        "@npm//react",
        "@npm//react-router-dom",
        "@npm//redux",
        "@npm//@reduxjs/toolkit",
        "@npm//reselect",
        "@npm//typesafe-actions",
        "@npm//camelcase-keys",
        "@npm//react-color",
        "@npm//audio-recorder-polyfill",
    ],
)

web_app(
    name = "bundle",
    dev_index = "development.html",
    entry = "frontend/inbox/src/index",
    index = ":index.html",
    output = {
        "publicPath": "/inbox/",
    },
    static_assets = "//frontend/inbox/public",
    ts_deps = [":app"] + ts_deps,
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
    repository = "inbox",
)

web_lint()
