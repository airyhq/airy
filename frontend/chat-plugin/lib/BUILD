load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")
load("//tools/lint:web.bzl", "web_lint")
load("//frontend/chat-plugin:deps.bzl", "npm_deps", "ts_deps")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "chat-plugin",
    srcs = glob(["**/*.json", "**/*.ts", "**/*.tsx"], exclude = ["publish_package.json"]),
    tsconfig = "//frontend/chat-plugin:widget_tsconfig",
    deps = ts_deps + npm_deps,
)

filegroup(
    name = "types",
    srcs = [":chat-plugin"],
    output_group = "types",
)

web_library(
    name = "dist",
    entry = "frontend/chat-plugin/lib/index.js",
    # Externals will not be included in the output bundle
    # Therefore they must be declared as dependencies in the package.json so that
    # npm can install them and make them available at user build time
    externals = {
        "@stomp/stompjs": "@stomp/stompjs",
        "@types/node": "@types/node",
        "@types/react": "@types/react",
        "@types/react-dom": "@types/react-dom",
        "linkifyjs": "linkifyjs",
        "react": "react",
        "react-dom": "react-dom",
        "camelcase-keys": "camelcase-keys",
        "emoji-mart": "emoji-mart",
    },
    output = {
        "library": "@airyhq/chat-plugin",
        "libraryTarget": "umd",
        "filename": "index.js",
        "uniqueName": "airy-chat-plugin",
    },
    ts_deps = [":chat-plugin"] + ts_deps,
)

genrule(
    name = "npm_library",
    srcs = [
        "publish_package.json",
        "README.md",
        ":dist",
        ":chat-plugin",
        ":types",
    ],
    outs = ["chat-plugin_npm_lib"],
    cmd = """
    mkdir -p $(OUTS)/{src,dist} && cp -R $(location :dist) $(OUTS) \
    && cp $(location :README.md) $(OUTS) \
    && cp $(location :publish_package.json) $(OUTS)/package.json \
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
