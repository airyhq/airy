load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@npm//@bazel/typescript:index.bzl", "ts_library")

ts_library(
    name = "specs",
    srcs = glob(["*.spec.ts"]),
    tsconfig = ":tsconfig.json",
    deps = [
        "@npm//cypress",
    ],
)

filegroup(
    name = "specs_output",
    srcs = [":specs"],
    output_group = "es5_sources",
)

nodejs_binary(
    name = "cypress",
    data = [
        ":cypress.json",
        ":specs_output",
        "@npm//cypress",
    ],
    entry_point = "@npm//:node_modules/cypress/bin/cypress",
    templated_args = [
        "open",
        "-C $(rootpath :cypress.json)",
    ],
)
