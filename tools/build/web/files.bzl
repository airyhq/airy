def _copy_filegroup_impl(ctx):
    build_path = ctx.build_file_path.replace("BUILD", "")

    all_input_files = []
    for group in ctx.attr.input_groups:
        all_input_files += group.files.to_list()

    all_outputs = []
    for f in all_input_files:
        path = f.path.replace(build_path, "")
        out = ctx.actions.declare_file(path)
        all_outputs += [out]
        ctx.actions.run_shell(
            outputs = [out],
            inputs = depset([f]),
            arguments = [f.path, out.path],
            command = "cp $1 $2",
        )

    return [
        DefaultInfo(
            files = depset(all_outputs),
            runfiles = ctx.runfiles(files = all_outputs),
        ),
    ]

# Copy file groups to bazel-out to make them accessible as generated files in web builds
copy_filegroups = rule(
    implementation = _copy_filegroup_impl,
    attrs = {
        "input_groups": attr.label_list(
            allow_files = True,
        ),
    },
)
