load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@npm//@bazel/typescript:index.bzl", "ts_config")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_app.bzl", "web_app")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("//tools/build:container_release.bzl", "container_release")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")
load("//tools/lint:web.bzl", "web_lint")
load("//frontend/chat-plugin:deps.bzl", "module_deps", "npm_deps")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "chat-plugin",
    tsconfig = "//frontend/chat-plugin:widget_tsconfig",
    deps = module_deps + npm_deps
)

web_library(
    name = "dist",
    app_lib = ":chat-plugin",
    entry = "frontend/chat-plugin/lib/index.js",
    externals = {
        "@stomp/stompjs": "@stomp/stompjs",
        "@types/node": "@types/node",
        "@types/react": "@types/react",
        "@types/react-dom": "@types/react-dom",
        "linkifyjs": "linkifyjs",
        "react": "react",
        "react-dom": "react-dom",
        "camelcase-keys": "camelcase-keys",
    },
    module_deps = module_deps,
    output = {
        "library": "@airyhq/chat-plugin",
        "libraryTarget": "umd",
        "filename": "index.js",
    },
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
    && mv $(RULEDIR)/src $(OUTS) && mv $(RULEDIR)/index.d.ts $(OUTS)
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
