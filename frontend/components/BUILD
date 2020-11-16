load("//tools/build/web:typescript.bzl", "ts_library")
load("//tools/build/web:web_library.bzl", "web_library")
load("//tools/build/npm:rules.bzl", "assemble_npm", "deploy_npm")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "components",
    data = glob(
        [
            "**/*.scss",
            "**/*.css",
            "**/*.json",
            "**/*.png",
            "**/*.svg",
            "**/*.json",
        ],
        exclude = ["package.json"],
    ),
    deps = [
        "@npm//@crello/react-lottie",
        "@npm//@types/prop-types",
        "@npm//@types/react",
        "@npm//emoji-mart",
        "@npm//react",
        "@npm//react-autosize-textarea",
        "@npm//react-modal",
        "@npm//react-router-dom",
    ],
)

web_library(
    name = "dist",
    app_lib = ":components",
    entry = "frontend/components/src/index.js",
    externals = {
        "react": "react",
        "react-dom": "react-dom",
        "react-router-dom": "react-router-dom",
        "@crello/react-lottie": "@crello/react-lottie",
        "emoji-mart": "emoji-mart",
        "react-autosize-textarea": "react-autosize-textarea",
        "react-modal": "react-modal",
    },
    output = {
        "library": "@airyhq/components",
        "globalObject": "this",
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
        ":components",
    ],
    outs = ["components_lib"],
    cmd = """
    mkdir -p $(OUTS)/{src,dist} && cp -R $(location :dist) $(OUTS) \
    && cp $(location :package.json) $(location :README.md) $(OUTS) \
    && mv $(RULEDIR)/src $(OUTS)
""",
)

assemble_npm(
    name = "assemble-npm",
    target = ":components_lib",
    version_file = ":VERSION",
)

deploy_npm(
    name = "publish-npm",
    release = "https://registry.npmjs.org/",
    snapshot = "https://registry.npmjs.org/",
    target = ":assemble-npm",
)
