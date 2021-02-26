load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

go_library(
    name = "integration",
    srcs = [
        "mockserver.go",
        "runner.go",
        "test_file.go",
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
        "api_login_test.go",
        "noargs_test.go",
        "version_test.go",
    ],
    data = [
        "//infrastructure/cli:airy",
        "//infrastructure/cli/integration/golden:golden_files",
    ],
    embed = [":integration"],
)

check_pkg(name = "buildifier")
