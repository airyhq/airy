load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = [
        "login_request.go",
        "login_response.go",
        "signup_request.go",
        "signup_response.go",
    ],
    importmap = "lib/go/payloads",
    importpath = "apiclient/payloads",
    visibility = ["//visibility:public"],
)
