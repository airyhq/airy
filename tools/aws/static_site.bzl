"""
Given an input list like

a/b/c/index.html
a/b/c/css/styles.css
a/b/c/css/normalize.css
a/b/c/css/mixins/mixin.css
d/index.html

where a/b/c and d are packages we want to return:

a/b/c/index.html
a/b/c/css/
d/index.html

to allow the user rule to copy everything to a directory
"""

def build_file_dir_list(static_files):
    files_and_directory_paths = []

    for file_target in static_files:
        package_segments = file_target.label.package.split("/") if file_target.label else []
        len_package_segments = len(package_segments)

        files = file_target.files.to_list()

        for file in files:
            file_segments = file.path.split("/")

            segment_diff = len(file_segments) - len(package_segments)

            if segment_diff < 1:
                fail("file " + file.path + " is not in package " + file_target.package)
            elif segment_diff == 1:  # File is at the package root so add directly
                files_and_directory_paths.append(file.path)
            else:
                # File is in a directory relative to package.
                # If there are multiple directories only take the top one
                top_level_dir = "/".join(file_segments[:(len_package_segments + 1)])
                if top_level_dir not in files_and_directory_paths:
                    files_and_directory_paths.append(top_level_dir)

    return files_and_directory_paths

def _static_site_impl(
        ctx,
        name = None,
        directory = None,
        files = None,
        bucket_name = None,
        distribution_id = None):
    name = name or ctx.attr.name

    directory = directory or ctx.attr.directory
    files = files or ctx.attr.files

    if directory == None and files == None:
        fail("You have to specify either a directory or static files")

    bucket_name = bucket_name or ctx.attr.bucket_name
    distribution_id = distribution_id or ctx.attr.distribution_id

    toolchain_info = ctx.toolchains["//tools/aws/toolchain:toolchain_type"].info

    directory_files = directory.files.to_list() if directory else []
    dir_name = directory_files[0].basename if directory else "tmp"

    # Generate a shell script to execute the run statement
    ctx.actions.expand_template(
        template = ctx.file._push_tpl,
        output = ctx.outputs.executable,
        substitutions = {
            "%{bucket_name}": bucket_name,
            "%{path}": ctx.attr.path,
            "%{dry_run}": "--dryrun" if ctx.attr.dry_run == True else "",
            "%{distribution_id}": distribution_id,
            "%{files}": ",".join(build_file_dir_list(files)),
            "%{source_directory}": ctx.label.package + "/" + dir_name,
            "%{tool_path}": toolchain_info.tool_path,
        },
        is_executable = True,
    )

    runfiles = ctx.runfiles(files = ctx.files.files + directory_files)

    files = depset(directory_files + [ctx.outputs.executable])

    return [
        DefaultInfo(executable = ctx.outputs.executable, files = files, runfiles = runfiles),
    ]

static_site = rule(
    attrs = {
        "directory": attr.label(
            mandatory = False,
            cfg = "target",
            allow_files = True,
        ),
        "files": attr.label_list(
            mandatory = False,
            cfg = "target",
            allow_files = True,
        ),
        "dry_run": attr.bool(),
        "path": attr.string(
            doc = "The target path of the s3 deployment.",
            default = "/",
        ),
        "_push_tpl": attr.label(
            default = Label("//tools/aws:push.sh.tpl"),
            allow_single_file = True,
        ),
        "distribution_id": attr.string(
            doc = "The id of the cloudfront distribution.",
            mandatory = False,
        ),
        "bucket_name": attr.string(
            doc = "name of the s3 bucket the data supposed to be uploaded to.",
            mandatory = True,
        ),
    },
    doc = ("This rule takes a web_bundle output dir or a list of files, uploads them to the given s3 bucket and creates an invalidation at /*"),
    executable = True,
    implementation = _static_site_impl,
    toolchains = ["//tools/aws/toolchain:toolchain_type"],
)
