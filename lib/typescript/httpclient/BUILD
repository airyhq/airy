load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")

package(default_visibility = ["//visibility:public"])

module_deps = [
    "//lib/typescript/model",
    "//lib/typescript/types",
]

ts_web_library(
    name = "httpclient",
    deps = module_deps + [
        "@npm//@types/node",
        "@npm//camelcase-keys",
        "@npm//isomorphic-fetch",
        "@npm//form-data",
    ],
)

web_library(
    name = "dist_browser",
    app_lib = ":httpclient",
    entry = "lib/typescript/httpclient/src/index.js",
    module_deps = module_deps,
    output = {
        "library": "@airyhq/http-client",
        "globalObject": "this",
        "libraryTarget": "umd",
        "filename": "browser.js",
    },
)

web_library(
    name = "dist_node",
    app_lib = ":httpclient",
    entry = "lib/typescript/httpclient/src/index.js",
    externals = {
        "camelcase-keys": "camelcase-keys",
        "isomorphic-fetch": "isomorphic-fetch",
        "form-data": "form-data",
    },
    module_deps = module_deps,
    output = {
        "library": "@airyhq/http-client",
        "globalObject": "this",
        "libraryTarget": "umd",
        "filename": "node.js",
    },
)

genrule(
    name = "npm_library",
    srcs = [
        "package.json",
        "README.md",
        ":dist_browser",
        ":dist_node",
        ":httpclient",
    ],
    outs = ["httpclient_lib"],
    cmd = """
    mkdir -p $(OUTS)/dist && cp $(location :dist_browser)/browser.js $(OUTS)/dist \
    && cp $(location :dist_node)/node.js $(OUTS)/dist \
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
