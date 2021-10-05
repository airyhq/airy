load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "create",
    srcs = [
        "create.go",
    ],
    importpath = "cli/pkg/cmd/create",
    visibility = ["//visibility:public"],
    x_defs = {
        "version": "{STABLE_VERSION}",
    },
    deps = [
        "//cli/pkg/cmd/config",
        "//cli/pkg/console",
        "//cli/pkg/helm",
        "//cli/pkg/kube",
        "//cli/pkg/providers",
        "//cli/pkg/workspace",
        "@com_github_spf13_cobra//:cobra",
        "@com_github_spf13_viper//:viper",
        "@com_github_twinproduction_go_color//:go-color",
        "@in_gopkg_segmentio_analytics_go_v3//:analytics-go_v3",
        "@io_k8s_api//batch/v1:go_default_library",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_api//rbac/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/watch:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
    ],
)

check_pkg(name = "buildifier")
