load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "payloads",
    srcs = [
        "login_request.go",
        "login_response.go",
        "signup_request.go",
        "signup_response.go",
    ],
    importmap = "lib/go/payloads",
    importpath = "httpclient/payloads",
    visibility = ["//visibility:public"],
)
