load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@npm//@bazel/typescript:index.bzl", "ts_config")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_release.bzl", "container_release")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")

package(default_visibility = ["//visibility:public"])

module_deps = [
    "//lib/typescript/assets",
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
    app_lib = ":chat-plugin",
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
    app_lib = ":chat-plugin",
    entry = "frontend/chat-plugin/src/defaultScript.js",
    module_deps = module_deps,
    output = {
        "libraryExport": "AiryWidget",
        "publicPath": "/chatplugin/ui",
        "filename": "s.js",
    },
)

ts_web_library(
    name = "chat-plugin",
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

genrule(
    name = "npm_library",
    srcs = [
        "package.json",
        "README.md",
        ":dist",
        ":chat-plugin",
    ],
    outs = ["chat-plugin_lib"],
    cmd = """
    mkdir -p $(OUTS)/{src,dist} && cp -R $(location :dist) $(OUTS) \
    && cp $(location :package.json) $(location :README.md) $(OUTS) \
    && mv $(RULEDIR)/src $(OUTS)
""",
)

assemble_npm(
    name = "assemble-npm",
    target = ":npm_library",
    version_file = "//:VERSION",
)

deploy_npm(
    name = "publish-npm",
    release = "https://registry.npmjs.org/",
    snapshot = "https://registry.npmjs.org/",
    target = ":assemble-npm",
)

check_pkg(name = "buildifier")

web_lint()
