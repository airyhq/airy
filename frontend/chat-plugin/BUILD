load("@npm_bazel_typescript//:index.bzl", "ts_config")
load("//tools/build/web:typescript.bzl", "ts_library")
load("//tools/build/web:webapp.bzl", "webapp")
load("//tools/build/web:web_library.bzl", "web_library")

module_deps = []

webapp(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/iframe.js",
    index = ":index.html",
    module_deps = module_deps,
)

web_library(
    name = "library",
    app_lib = ":app",
    entry = "frontend/chat-plugin/src/defaultScript.js",
    module_deps = module_deps,
    output = {
        "libraryExport": "AiryWidget",
        "publicPath": "/",
        "filename": "s.js",
    },
)

ts_library(
    name = "app",
    tsconfig = ":widget_tsconfig",
    deps = module_deps + [
        "@npm//@types/node",
        "@npm//@stomp/stompjs",
        "@npm//preact",
        "@npm//preact-router",
        "@npm//linkifyjs",
    ],
)

ts_config(
    name = "widget_tsconfig",
    src = "tsconfig.json",
    deps = ["//:tsconfig.json"],
)
