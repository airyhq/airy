load("@com_github_airyhq_bazel_tools//minikube:minikube.bzl", "minikube_start", "minikube_stop")

exports_files([
    "defaults.yaml",
])

minikube_start(
    name = "minikube-start",
)

minikube_stop(
    name = "minikube-stop",
)
