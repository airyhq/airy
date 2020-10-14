AwsToolchainInfo = provider(
    doc = "AWS toolchain rule parameters",
    fields = {
        "tool_path": "Path to the aws cli",
    },
)

def _aws_toolchain_impl(ctx):
    toolchain_info = platform_common.ToolchainInfo(
        info = AwsToolchainInfo(
            tool_path = ctx.attr.tool_path,
        ),
    )
    return [toolchain_info]

# Rule used by the aws toolchain rule to specify a path to the aws
# binary
aws_toolchain = rule(
    implementation = _aws_toolchain_impl,
    attrs = {
        "tool_path": attr.string(
            doc = "Path to the aws cli.",
        ),
    },
)
