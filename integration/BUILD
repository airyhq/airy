load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

nodejs_binary(
    name = "cypress",
    data = [
        ":cypress.config.ts",
        "//integration/chat-plugin",
        "//integration/ui",
        "@npm//cypress",
    ],
    entry_point = {
        "@npm//:node_modules/cypress": "/bin/cypress",
    },
    templated_args = [
        "open",
        "-C $(rootpath :cypress.config.ts)",
    ],
)

nodejs_binary(
    name = "cypress_run",
    data = [
        ":cypress.config.ts",
        "//integration/chat-plugin",
        "//integration/commands",
        "//integration/ui",
        "@npm//cypress",
    ],
    entry_point = {
        "@npm//:node_modules/cypress": "/bin/cypress",
    },
    templated_args = [
        "run",
        "-C $(rootpath :cypress.config.ts)",
    ],
)
