load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "deploy",
    srcs = ["deploy.go"],
    importpath = "cli/pkg/cmd/deploy",
    visibility = ["//visibility:public"],
    x_defs = {
        "Version": "{STABLE_VERSION}",
    },
    deps = [
        "//cli/pkg/console",
        "//cli/pkg/providers",
        "//infrastructure/lib/go/k8s/util",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_twinproduction_go_color//:go-color",
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
    ],
)

check_pkg(name = "buildifier")
