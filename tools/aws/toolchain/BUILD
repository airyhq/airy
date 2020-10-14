load(":toolchain.bzl", "aws_toolchain")

package(default_visibility = ["//visibility:public"])

AWS_TOOLCHAIN = "//tools/aws/toolchain:toolchain_type"

# aws toolchain type
toolchain_type(name = "toolchain_type")

# Default aws toolchain that expects the 'aws' cli
# to be in the PATH.
aws_toolchain(
    name = "default_toolchain_impl",
    tool_path = "aws",
    visibility = ["//visibility:public"],
)

toolchain(
    name = "aws_toolchain_osx",
    target_compatible_with = [
        "@bazel_tools//platforms:osx",
    ],
    toolchain = ":default_toolchain_impl",
    toolchain_type = AWS_TOOLCHAIN,
)

toolchain(
    name = "aws_toolchain_linux",
    target_compatible_with = [
        "@bazel_tools//platforms:linux",
    ],
    toolchain = ":default_toolchain_impl",
    toolchain_type = AWS_TOOLCHAIN,
)
