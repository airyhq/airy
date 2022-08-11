load("@rules_pkg//:pkg.bzl", "pkg_tar")
load("@com_github_airyhq_bazel_tools//helm:helm.bzl", lib_helm_push = "helm_push", "helm_template_test")

def helm_push(chart):
    lib_helm_push(
        name = "helm_push_testing",
        repository_url = "https://testing.helm.airy.co",
        repository_name = "airy",
        auth = "none",
        chart = chart,
        version_file = Label("//:VERSION"),
    )

    lib_helm_push(
        name = "helm_push",
        repository_url = "https://helm.airy.co",
        repository_name = "airy",
        auth = "basic",
        chart = chart,
        version_file = Label("//:VERSION"),
    )

def helm_push_version(chart, version):
    lib_helm_push(
        name = "helm_push_testing",
        repository_url = "https://testing.helm.airy.co",
        repository_name = "airy",
        auth = "none",
        chart = chart,
        version = version,
        version_file = Label("//:VERSION"),
    )

    lib_helm_push(
        name = "helm_push",
        repository_url = "https://helm.airy.co",
        repository_name = "airy",
        auth = "basic",
        chart = chart,
        version = version,
        version_file = Label("//:VERSION"),
    )

def helm_ruleset_core_version():
    native.filegroup(
        name = "files",
        srcs = native.glob(
            ["**/*"],
            exclude = ["BUILD"],
        ),
        visibility = ["//visibility:public"],
    )

    pkg_tar(
        name = "package",
        srcs = [":files"],
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
