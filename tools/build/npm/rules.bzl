#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

def _assemble_npm_impl(ctx):
    if len(ctx.files.target) != 1:
        fail("target contains more files than expected")

    if not ctx.attr.version_file:
        version_file = ctx.actions.declare_file(ctx.attr.name + "__do_not_reference.version")
        version = ctx.var.get("version", "0.0.0")

        if len(version) == 40:
            # this is a commit SHA, most likely
            version = "0.0.0-{}".format(version)

        ctx.actions.run_shell(
            inputs = [],
            outputs = [version_file],
            command = "echo {} > {}".format(version, version_file.path),
        )
    else:
        version_file = ctx.file.version_file

    args = ctx.actions.args()
    args.add("--package", ctx.files.target[0].path)
    args.add("--output", ctx.outputs.npm_package.path)
    args.add("--version_file", version_file.path)

    ctx.actions.run(
        inputs = ctx.files.target + ctx.files._npm + [version_file],
        outputs = [ctx.outputs.npm_package],
        arguments = [args],
        executable = ctx.executable._assemble_script,
        # note: do not run in RBE
    )

assemble_npm = rule(
    implementation = _assemble_npm_impl,
    attrs = {
        "target": attr.label(
            mandatory = True,
            doc = "`npm_library` label to be included in the package",
        ),
        "version_file": attr.label(
            allow_single_file = True,
            doc = """
            File containing version string.
            Alternatively, pass --define version=VERSION to Bazel invocation.
            Not specifying version at all defaults to '0.0.0'
            """,
        ),
        "_assemble_script": attr.label(
            default = "//tools/build/npm:assemble",
            executable = True,
            cfg = "host",
        ),
        "_npm": attr.label(
            default = Label("@nodejs_host//:npm"),
            allow_files = True,
        ),
    },
    outputs = {
        "npm_package": "%{name}.tar.gz",
    },
    doc = "Assemble `npm_package` target for further deployment. Currently does not support remote execution (RBE).",
)

def _deploy_npm(ctx):
    ctx.actions.expand_template(
        template = ctx.file._deployment_script_template,
        output = ctx.outputs.executable,
        substitutions = {
            "{snapshot}": ctx.attr.snapshot,
            "{release}": ctx.attr.release,
        },
        is_executable = True,
    )

    files = [
        ctx.file.target,
    ]
    files.extend(ctx.files._npm)

    return DefaultInfo(
        executable = ctx.outputs.executable,
        runfiles = ctx.runfiles(
            files = files,
            symlinks = {
                "deploy_npm.tgz": ctx.file.target,
            },
        ),
    )

deploy_npm = rule(
    implementation = _deploy_npm,
    executable = True,
    attrs = {
        "target": attr.label(
            mandatory = True,
            allow_single_file = True,
            doc = "`assemble_npm` label to be included in the package",
        ),
        "snapshot": attr.string(
            mandatory = True,
            doc = "Snapshot repository to deploy npm artifact to",
        ),
        "release": attr.string(
            mandatory = True,
            doc = "Release repository to deploy npm artifact to",
        ),
        "_deployment_script_template": attr.label(
            allow_single_file = True,
            default = "//tools/build/npm/templates:deploy.py",
        ),
        "_npm": attr.label(
            default = Label("@nodejs_host//:npm"),
            allow_files = True,
        ),
    },
)
