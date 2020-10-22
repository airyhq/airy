load("//tools/build/web:typescript.bzl", "ts_library")
load("//tools/build/web:webapp.bzl", "webapp")

webapp(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/showcase/src/index.js",
    index = ":index.html",
    static_assets = "//frontend/showcase/public",
)

ts_library(
    name = "app",
    deps = [
        "@npm//@airyhq/components",
        "@npm//@crello/react-lottie",
        "@npm//@types/prop-types",
        "@npm//@types/react",
        "@npm//emoji-mart",
        "@npm//moment",
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-modal",
        "@npm//react-redux",
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
