load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@npm//@bazel/typescript:index.bzl", "ts_config")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_release.bzl", "container_release")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

module_deps = [
    "//frontend/assets",
    "//lib/typescript/components",
    "//lib/typescript/types",
    "//lib/typescript/model",
    "//lib/typescript/render",
    "//lib/typescript/dates",
    "//frontend/chat-plugin/handles:chat-plugin-handles",
]

web_app(
    name = "bundle",
    aliases = {
        "react": "preact/compat",
        "react-dom": "preact/compat",
    },
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/iframe",
    index = ":development.html",
    module_deps = module_deps,
    output = {
        "publicPath": "/chatplugin/ui",
    },
)

web_library(
    name = "library",
    aliases = {
        "react": "preact/compat",
        "react-dom": "preact/compat",
    },
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/defaultScript.js",
    module_deps = module_deps,
    output = {
        "libraryExport": "AiryWidget",
        "publicPath": "/chatplugin/ui",
        "filename": "s.js",
    },
)

ts_web_library(
    name = "app",
    tsconfig = ":widget_tsconfig",
    deps = module_deps + [
        "@npm//@stomp/stompjs",
        "@npm//@types/node",
        "@npm//@types/react",
        "@npm//@types/react-dom",
        "@npm//linkifyjs",
        "@npm//react",
        "@npm//react-dom",
        "@npm//camelcase-keys",
    ],
)

ts_config(
    name = "widget_tsconfig",
    src = "bazel.tsconfig.json",
    deps = ["//:bazel.tsconfig.json"],
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

container_release(
    registry = "ghcr.io/airyhq/frontend",
    repository = "chat-plugin",
)

check_pkg(name = "buildifier")

web_lint()
