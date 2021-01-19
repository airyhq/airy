load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "RenderLibrary",
    srcs = glob([
        "**/*.d.tsx",
    ]),
    deps = [
        "//lib/typescript/httpclient",
        "//lib/typescript/types",
        "@npm//@types/node",
        "@npm//@types/react",
    ],
)
