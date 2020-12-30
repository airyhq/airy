load("@io_bazel_rules_go//go:def.bzl", "go_test")

go_test(
    name = "api-client-test_test",
    srcs = ["users_test.go"],
    deps = [
        "//lib/go/httpclient",
        "//lib/go/httpclient/payloads",
        "@com_github_stretchr_testify//assert",
    ],
)
