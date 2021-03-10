load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")
load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "config",
    srcs = [
        "config.go",
        "configmaps.go",
        "parser.go",
    ],
    importpath = "cli/pkg/cmd/config",
    visibility = ["//visibility:public"],
    deps = [
        "@com_github_mitchellh_go_homedir//:go-homedir",
        "@com_github_spf13_cobra//:cobra",
        "@in_gopkg_yaml_v2//:yaml_v2",
        "@io_k8s_api//core/v1:go_default_library",
        "@io_k8s_apimachinery//pkg/apis/meta/v1:go_default_library",
        "@io_k8s_client_go//kubernetes:go_default_library",
        "@io_k8s_client_go//tools/clientcmd:go_default_library",
    ],
)

check_pkg(name = "buildifier")
