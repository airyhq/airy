load("@com_github_bazelbuild_buildtools//buildifier:def.bzl", "buildifier")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@com_github_atlassian_bazel_tools//multirun:def.bzl", "multirun")

multirun(
    name = "check",
    commands = [
        "check_prettier",
        "check_buildifier",
    ],
    parallel = True,
    visibility = ["//visibility:public"],
)

multirun(
    name = "fix",
    commands = [
        "fix_prettier",
        "fix_buildifier",
    ],
    visibility = ["//visibility:public"],
)

nodejs_binary(
    name = "check_prettier",
    data = [
        "chdir.js",
        "@npm//prettier",
    ],
    entry_point = "@npm//:node_modules/prettier/bin-prettier.js",
    install_source_map_support = False,
    templated_args = [
        # This is a little trick we need to do in order to run prettier in the workspace root
        # The check_prettier.sh executable can not be used in other executable rules
        "--node_options=--require=$$(rlocation $(rootpath chdir.js))",
        "--check '**/*.{css,scss,ts,tsx,js}'",
    ],
)

buildifier(
    name = "check_buildifier",
    mode = "diff",
)

nodejs_binary(
    name = "fix_prettier",
    data = [
        "chdir.js",
        "@npm//prettier",
    ],
    entry_point = "@npm//:node_modules/prettier/bin-prettier.js",
    install_source_map_support = False,
    templated_args = [
        # This is a little trick we need to do in order to run prettier in the workspace root
        # The check_prettier.sh executable can not be used in other executable rules
        "--node_options=--require=$$(rlocation $(rootpath chdir.js))",
        "'**/*.{css,scss,ts,tsx,js}'",
        "--write",
    ],
)

buildifier(
    name = "fix_buildifier",
    lint_mode = "fix",
    mode = "fix",
)
