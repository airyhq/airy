load("@io_bazel_rules_go//go:def.bzl", "go_test")

go_test(
    name = "go_default_test",
    srcs = ["apiclient_test.go"],
    deps = [
        "//lib/go/apiclient:go_default_library",
        "//lib/go/apiclient/payloads:go_default_library",
        "@com_github_stretchr_testify//assert:go_default_library",
    ],
)
