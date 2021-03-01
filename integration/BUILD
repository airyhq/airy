load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

nodejs_binary(
    name = "cypress",
    data = [
        ":cypress.json",
        "//integration/chatplugin:specs_output",
        "//integration/ui:specs_output",
        "@npm//cypress",
    ],
    entry_point = "@npm//:node_modules/cypress/bin/cypress",
    templated_args = [
        "open",
        "-C $(rootpath :cypress.json)",
    ],
)
