load("@npm//@bazel/typescript:index.bzl", "ts_library")

ts_library(
    name = "specs",
    srcs = glob(["*.spec.ts"]),
    tsconfig = ":tsconfig.json",
    deps = [
        "@npm//cypress",
    ],
)

filegroup(
    name = "specs_output",
    srcs = [":specs"],
    output_group = "es5_sources",
    visibility = ["//integration:__pkg__"],
)
