load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

go_library(
    name = "integration",
    srcs = [
        "mockserver.go",
        "runner.go",
        "test_file.go",
    ],
    embedsrcs = [
        "golden/cli.login.golden",
        "golden/cli.no-args.golden",
        "golden/cli.version.golden",
        "golden/cli.yaml",
        "golden/users.signup.golden",
    ],
    importpath = "cli/integration",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_kr_pretty//:pretty",
        "@io_goji//:goji.io",
        "@io_goji//pat",
    ],
)

go_test(
    name = "integration_test",
    srcs = [
        "cli_test.go",
        "version_test.go",
    ],
    data = [
        "//cli:airy",
    ],
    embed = [":integration"],
)

check_pkg(name = "buildifier")
