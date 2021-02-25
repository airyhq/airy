# See the springboot.bzl file for detailed usage instructions.

load("@com_github_airyhq_bazel_tools//code-format:buildifier.bzl", "check_pkg")

package(default_visibility = ["//visibility:public"])

exports_files([
    "springboot.bzl",
    "springboot_pkg.sh",
    "helper.bzl",
    "log4j2.properties",
    "nogo_config.json",
])

check_pkg(name = "buildifier")
