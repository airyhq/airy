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
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-modal",
        "@npm//react-router-dom",
    ],
)

load("//tools/aws:static_site.bzl", "static_site")

static_site(
    name = "deploy",
    bucket_name = "components.airy.co",
    directory = ":bundle",
    distribution_id = "E2EV0JFTC3HOMS",
)
