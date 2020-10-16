package(default_visibility = ["//visibility:public"])

load("//tools/build/web:typescript.bzl", "ts_library")
load("@npm_bazel_typescript//:index.bzl", "ts_config")
load("//tools/build/web:web_library.bzl", "web_library")

lib_deps = [
    "@npm//@crello/react-lottie",
    "@npm//@types/prop-types",
    "@npm//@types/react",
    "@npm//emoji-mart",
    "@npm//moment",
    "@npm//react",
    "@npm//react-autosize-textarea",
    "@npm//react-dates",
    "@npm//react-i18next",
    "@npm//react-modal",
    "@npm//react-redux",
    "@npm//react-router-dom",
    "@npm//react-svg",
]

ts_library(
    name = "components",
    tsconfig = "//:tsconfig.json",
    deps = lib_deps,
)


web_library(
    name = "dist",
    app_lib = ":components",
    entry = "frontend/components/index.js",
    output = {
        "library": "AiryComponents",
        "libraryTarget": "umd",
        "filename": "index.js"
    }
)

genrule(
    name = "npm_library",
    outs = ["components_lib"],
    srcs = [":package.json", ":dist"],
    cmd = "cp -r $(location :dist) $(OUTS) && cp $(location :package.json) $(OUTS)"
)

load("//tools/build/npm:rules.bzl", "deploy_npm", "assemble_npm")

assemble_npm(
    name = "assemble-npm",
    target = ":components_lib",
    version_file = ":VERSION.txt",
)

deploy_npm(
    name = "deploy-npm",
    target = ":assemble-npm",
    release = "https://registry.npmjs.org/",
    snapshot = "https://registry.npmjs.org/"
)
