load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")

package(default_visibility = ["//visibility:public"])

ts_deps = [
    "//lib/typescript/model",
]

ts_web_library(
    name = "httpclient",
    srcs = glob(
        [
            "**/*.json",
            "**/*.ts",
            "**/*.tsx",
        ],
        exclude = ["publish_package.json"],
    ),
    deps = ts_deps + [
        "@npm//@types/node",
        "@npm//camelcase-keys",
        "@npm//isomorphic-fetch",
        "@npm//form-data",
    ],
)

filegroup(
    name = "types",
    srcs = [":httpclient"],
    output_group = "types",
)

web_library(
    name = "dist_browser",
    entry = "lib/typescript/httpclient/src/index.js",
    output = {
        "library": "@airyhq/http-client",
        "globalObject": "this",
        "libraryTarget": "umd",
        "filename": "browser.js",
    },
    ts_deps = [":httpclient"] + ts_deps,
)

web_library(
    name = "dist_node",
    entry = "lib/typescript/httpclient/src/index.js",
    externals = {
        "camelcase-keys": "camelcase-keys",
        "isomorphic-fetch": "isomorphic-fetch",
        "form-data": "form-data",
    },
    output = {
        "library": "@airyhq/http-client",
        "globalObject": "this",
        "libraryTarget": "umd",
        "filename": "node.js",
    },
    ts_deps = [":httpclient"] + ts_deps,
)

genrule(
    name = "npm_library",
    srcs = [
        "publish_package.json",
        "README.md",
        ":dist_browser",
        ":dist_node",
        ":httpclient",
        ":types",
    ],
    outs = ["httpclient_lib"],
    cmd = """
    mkdir -p $(OUTS)/dist && cp $(location :dist_browser)/browser.js $(OUTS)/dist \
    && cp $(location :dist_node)/node.js $(OUTS)/dist \
    && mv $(RULEDIR)/src $(OUTS) \
    && cp $(location :README.md) $(OUTS) \
    && cp $(location :publish_package.json) $(OUTS)/package.json \
    && ls $(OUTS) && cat $(OUTS)/package.json
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
