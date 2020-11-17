load("//tools/build/web:typescript.bzl", "ts_library")
load("//tools/build/web:webapp.bzl", "webapp")

module_deps = [
    "//frontend/components",
]

ts_library(
    name = "app",
    deps = module_deps + [
        "@npm//@airyhq/components",
        "@npm//@types/react-redux",
        "@npm//react-svg",
        "@npm//redux",
        "@npm//redux-starter-kit",
        "@npm//@crello/react-lottie",
        "@npm//@types/prop-types",
        "@npm//@types/react",
        "@npm//emoji-mart",
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-modal",
        "@npm//react-router-dom",
        "@npm//typesafe-actions",
        "@npm//lodash-es",
        "@npm//@types/node",
    ],
)

webapp(
    name = "bundle",
    app_lib = ":app",
    entry = "frontend/demo/src/index.js",
    index = ":index.html",
    module_deps = module_deps,
    static_assets = "//frontend/demo/public",
)

load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_push")

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
    name = "release",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/frontend",
    repository = "demo",
    tag = "latest",
)

container_push(
    name = "beta",
    format = "Docker",
    image = ":image",
    registry = "ghcr.io/airyhq/frontend",
    repository = "demo",
    tag = "beta",
)