load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")
# gazelle:prefix github.com/airyhq/airy/lib/go/httpclient/payloads

go_library(
    name = "payloads",
    srcs = [
        "client_config_request_payload.go",
        "client_config_response_payload.go",
    ],
    importpath = "github.com/airyhq/airy/lib/go/httpclient/payloads",
    visibility = ["//visibility:public"],
)

check_pkg(name = "buildifier")
