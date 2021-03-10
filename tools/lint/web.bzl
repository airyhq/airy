load("@com_github_airyhq_bazel_tools//lint:prettier.bzl", "prettier")
load("@com_github_airyhq_bazel_tools//lint:eslint.bzl", "eslint")

def web_lint():
    if "prettier" not in native.existing_rules().keys():
        prettier(name = "prettier", config = "//:.prettierrc.json", ignore = "//:.prettierignore")
    if "eslint" not in native.existing_rules().keys():
        eslint(name = "eslint", config = "//:.eslintrc", ignore = "//:.prettierignore")
