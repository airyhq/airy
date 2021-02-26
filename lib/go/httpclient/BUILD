load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library", "go_test")

# gazelle:prefix github.com/airyhq/airy/lib/go/httpclient

go_library(
    name = "httpclient",
    srcs = [
        "client.go",
        "httpclient.go",
        "users.go",
    ],
    importpath = "github.com/airyhq/airy/lib/go/httpclient",
    visibility = ["//visibility:public"],
    deps = ["//lib/go/httpclient/payloads"],
)

go_test(
    name = "httpclient_test",
    srcs = ["users_test.go"],
    embed = [":httpclient"],
    deps = [
        "//lib/go/httpclient/payloads",
        "@com_github_stretchr_testify//assert",
    ],
)

check_pkg(name = "buildifier")
