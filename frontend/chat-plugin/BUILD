load("@npm_bazel_typescript//:index.bzl", "ts_config")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_push.bzl", "container_push")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

web_app(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/iframe.js",
    index = ":index.html",
)

web_library(
    name = "library",
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/defaultScript.js",
    output = {
        "libraryExport": "AiryWidget",
        "publicPath": "/",
        "filename": "s.js",
    },
)

ts_library(
    name = "app",
    tsconfig = ":widget_tsconfig",
    deps = [
        "//lib/typescript/types",
        "@npm//@stomp/stompjs",
        "@npm//@types/node",
        "@npm//linkifyjs",
        "@npm//preact",
        "@npm//preact-router",
    ],
)

ts_config(
    name = "widget_tsconfig",
    src = "tsconfig.json",
    deps = ["//:tsconfig.json"],
)

pkg_tar(
    name = "bundle_tar",
    srcs = [":library"],
    package_dir = "/usr/share/nginx/html/",
    strip_prefix = "./library",
)

pkg_tar(
    name = "example_tar",
    srcs = [":example.html"],
    package_dir = "/usr/share/nginx/html/",
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
        ":example_tar",
        ":conf_tar",
    ],
    visibility = ["//visibility:public"],
)

container_push(
    registry = "ghcr.io/airyhq/frontend",
    repository = "chat-plugin",
)
