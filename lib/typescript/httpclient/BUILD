load("//tools/lint:web.bzl", "web_lint")
load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")
load("@com_github_airyhq_bazel_tools//web:web_library.bzl", "web_library")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "httpclient",
    deps = [
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//camelcase-keys",
    ],
)

web_library(
    name = "dist",
    app_lib = ":httpclient",
    entry = "typescript/httpclient/index.ts",
    externals = {
        "@types/node": "@types/node",
        "camelcase-keys": "camelcase-keys",
    },
    output = {
        "library": "@airyhq/httpClient",
        "globalObject": "this",
        "libraryTarget": "umd",
        "filename": "index.ts",
    },
)

genrule(
    name = "npm_library",
    srcs = [
        "package.json",
        "README.md",
        ":dist",
        ":httpClient",
    ],
    outs = ["httpClient_lib"],
    cmd = """
    mkdir -p $(OUTS)/{src,dist} && cp -R $(location :dist) $(OUTS) \
    && cp $(location :package.json) $(location :README.md) $(OUTS) \
    && mv $(RULEDIR)/src $(OUTS)
""",
)

assemble_npm(
    name = "assemble-npm",
    target = ":httpClient_lib",
    version_file = ":VERSION",
)

deploy_npm(
    name = "publish-npm",
    release = "https://registry.npmjs.org/",
    snapshot = "https://registry.npmjs.org/",
    target = ":assemble-npm",
)

web_lint()
