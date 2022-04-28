load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("@com_github_airyhq_bazel_tools//helm:helm.bzl", "helm_template_test")
load("//tools/build:helm.bzl", "helm_push")

filegroup(
    name = "files",
    srcs = glob(
        ["**/*"],
        exclude = ["BUILD"],
    ),
)

pkg_tar(
    name = "package",
    srcs = [
        ":files",
        "//infrastructure/helm-chart/charts/ingress-controller:files",
        "//infrastructure/helm-chart/charts/prerequisites/charts/beanstalkd:files",
        "//infrastructure/helm-chart/charts/prerequisites/charts/kafka:files",
        "//infrastructure/helm-chart/charts/tools/charts/akhq:files",
        "//infrastructure/helm-chart/charts/tools/charts/kafka-connect:files",
    ],
    extension = "tgz",
    strip_prefix = "./",
)

helm_template_test(
    name = "template",
    chart = ":package",
)

helm_push(
    chart = ":package",
)
