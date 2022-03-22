load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("//frontend/chat-plugin:deps.bzl", "npm_deps", "ts_deps")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "dev",
    tsconfig = "//frontend/chat-plugin:widget_tsconfig",
    deps = ["//frontend/chat-plugin/lib:chat-plugin"] + ts_deps + npm_deps,
)

web_app(
    name = "bundle",
    aliases = {
        "react": "preact/compat",
        "react-dom": "preact/compat",
    },
    entry = "frontend/chat-plugin/dev/index",
    index = ":development.html",
    output = {
        "publicPath": "/chatplugin/ui/",
    },
    ts_deps = [
        "//frontend/chat-plugin/lib:chat-plugin",
        ":dev",
    ] + ts_deps,
)

check_pkg(name = "buildifier")

web_lint()
