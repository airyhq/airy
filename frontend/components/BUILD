package(default_visibility = ["//visibility:public"])

load("//tools/build/web:typescript.bzl", "ts_library")

ts_library(
    name = "components",
    tsconfig = "//:tsconfig.json",
    deps = [
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
    ],
)

load("@graknlabs_bazel_distribution//npm:rules.bzl", "deploy_npm", "assemble_npm")

assemble_npm(
    name = "assemble-npm",
    target = "//frontend/components",
    version_file = "1.0.0",    
)

deploy_npm(
    name = "deploy-npm",
    target = ":assemble-npm",
    release = ""
    snapshot = "https://github.com/airyhq/core/frontend/components"
)