load("@rules_java//java:defs.bzl", "java_library")

def _new_generator_command(ctx, src_dir, gen_dir):
    gen_command = "{java} -jar {tool} compile ".format(
        java = ctx.attr._jdk[java_common.JavaRuntimeInfo].java_executable_exec_path,
        tool = ctx.file._avro_tools.path,
    )

    if ctx.attr.strings:
        gen_command += " -string"

    if ctx.attr.encoding:
        gen_command += " -encoding {encoding}".format(
            encoding = ctx.attr.encoding,
        )

    gen_command += " schema {src} {gen_dir}".format(
        src = src_dir,
        gen_dir = gen_dir,
    )

    return gen_command

def _impl(ctx):
    src_dirs = [f.path for f in ctx.files.srcs]

    gen_dir = "{out}-tmp".format(
        out = ctx.outputs.codegen.path,
    )
    commands = [
        "mkdir -p {gen_dir}".format(gen_dir = gen_dir),
        _new_generator_command(ctx, " ".join(src_dirs), gen_dir),
        # forcing a timestamp for deterministic artifacts
        "find {gen_dir} -exec touch -t 198001010000 {{}} \\;".format(
            gen_dir = gen_dir,
        ),
        "{jar} cMf {output} -C {gen_dir} .".format(
            jar = "%s/bin/jar" % ctx.attr._jdk[java_common.JavaRuntimeInfo].java_home,
            output = ctx.outputs.codegen.path,
            gen_dir = gen_dir,
        ),
    ]

    inputs = ctx.files.srcs + ctx.files._jdk + [
        ctx.file._avro_tools,
    ]

    ctx.actions.run_shell(
        inputs = inputs,
        outputs = [ctx.outputs.codegen],
        command = " && ".join(commands),
        progress_message = "generating avro srcs",
        mnemonic = "CompileAvro",
        arguments = [],
    )

    return struct(
        codegen = ctx.outputs.codegen,
    )

avro_gen = rule(
    attrs = {
        "srcs": attr.label_list(
            allow_files = [".avsc"],
        ),
        "strings": attr.bool(),
        "encoding": attr.string(),
        "_jdk": attr.label(
            default = Label("@bazel_tools//tools/jdk:current_java_runtime"),
            allow_files = True,
            providers = [java_common.JavaRuntimeInfo],
        ),
        "_avro_tools": attr.label(
            cfg = "exec",
            default = Label("@maven//:org_apache_avro_avro_tools"),
            allow_single_file = True,
        ),
    },
    outputs = {
        "codegen": "%{name}_codegen.srcjar",
    },
    implementation = _impl,
)

def avro_java_library(
        name,
        srcs = None,
        strings = True,
        encoding = None,
        visibility = None):
    srcs = srcs if srcs else [name + ".avsc"]

    avro_gen(
        name = name + "_srcjar",
        srcs = srcs,
        strings = strings,
        encoding = encoding,
        visibility = visibility,
    )
    java_library(
        name = name,
        srcs = [name + "_srcjar"],
        deps = [
            Label("@maven//:org_apache_avro_avro"),
        ],
        visibility = visibility,
    )
