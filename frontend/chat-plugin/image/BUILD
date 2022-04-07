load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/lint:web.bzl", "web_lint")
load("//tools/build:container_release.bzl", "container_release")
load("//frontend/chat-plugin:deps.bzl", "npm_deps", "ts_deps")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "lib",
    tsconfig = "//frontend/chat-plugin:widget_tsconfig",
    deps = ["//frontend/chat-plugin/lib:chat-plugin"] + ts_deps + npm_deps,
)

web_library(
    name = "library",
    aliases = {
        "react": "preact/compat",
        "react-dom": "preact/compat",
    },
    entry = "frontend/chat-plugin/image/index",
    output = {
        "libraryExport": "AiryWidget",
        # Automatically detects script host and uses it for further loading
        # https://webpack.js.org/guides/public-path/#automatic-publicpath
        "publicPath": "auto",
        "filename": "s.js",
    },
    ts_deps = [
        "//frontend/chat-plugin/lib:chat-plugin",
        ":lib",
    ] + ts_deps,
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
