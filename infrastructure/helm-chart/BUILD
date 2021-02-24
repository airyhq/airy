load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("//tools/build:container_push.bzl", "container_push")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

filegroup(
    name = "chart",
    srcs = glob(["**/*"])
)

pkg_tar(
    name = "chart_tar",
    srcs = [":chart"],
    package_dir = "/apps/helm-chart", # cwd of the helm image
    strip_prefix = "./",
)

container_image(
    name = "image",
    base = "@helm//image",
    tars = [
        ":chart_tar"
    ],
    visibility = ["//visibility:public"],
)

container_push(
    registry = "ghcr.io/airyhq/infrastructure",
    repository = "helm",
)
