load("@com_github_masmovil_bazel_rules//helm:helm.bzl", "helm_chart", "helm_push", "helm_release")

helm_chart(
    name = "helm_chart",
    package_name = "airy",
    srcs = glob(["**"]),
    helm_chart_version = "0.41.0",
)
