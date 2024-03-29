load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

# gazelle:prefix github.com/airyhq/airy/backend/components/streams
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//go:image.bzl", "go_image")
load("//tools/build:container_release.bzl", "container_release")

go_library(
    name = "streams_lib",
    srcs = [
        "auth.go",
        "cors.go",
        "main.go",
        "streams_create.go",
        "streams_delete.go",
        "streams_info.go",
        "streams_list.go",
    ],
    importpath = "github.com/airyhq/airy/backend/components/streams",
    visibility = ["//visibility:private"],
    deps = [
        "//lib/go/httpclient",
        "//lib/go/payloads",
        "@com_github_golang_jwt_jwt//:jwt",
        "@com_github_gorilla_mux//:mux",
        "@io_k8s_klog//:klog",
    ],
)

go_binary(
    name = "streams",
    out = "streams",
    embed = [":streams_lib"],
    visibility = ["//visibility:public"],
)

genrule(
    name = "streams_bin_rule",
    srcs = [":streams"],
    outs = ["streams_bin"],
    cmd = "cp $(SRCS) $@",
)

go_image(
    name = "image",
    embed = [":streams_lib"],
)

container_release(
    registry = "ghcr.io/airyhq/api/components",
    repository = "streams",
)

check_pkg(name = "buildifier")
