load("//tools/build/web:typescript.bzl", "ts_library")
load("//tools/build/web:webapp.bzl", "webapp")

module_deps = [
    "//frontend/components",
]

webapp(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/showcase/src/index.js",
    index = ":index.html",
    module_deps = module_deps,
    static_assets = "//frontend/showcase/public",
)

ts_library(
    name = "app",
    deps = module_deps + [
        "@npm//@crello/react-lottie",
        "@npm//@types/prop-types",
        "@npm//@types/react",
        "@npm//emoji-mart",
        "@npm//moment",
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-dates",
        "@npm//react-modal",
        "@npm//react-redux",
        "@npm//react-router-dom",
        "@npm//react-svg",
    ],
)
