load("@com_github_airyhq_bazel_tools//helm:helm.bzl", lib_helm_push = "helm_push")

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
