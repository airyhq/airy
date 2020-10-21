load("//tools/build/web:typescript.bzl", "get_assets_label")
load("@npm//webpack-cli:index.bzl", webpack = "webpack_cli")

"""
Usage

web_library(
    name = "bundle",
    app_lib = ":app",
    entry = "ui/web/widget/src/index.js",
    module_deps = module_deps
)

parameters:

name            - Unique name of the build rule. The dev server rule will be called name_server
app_lib         - Label of the ts_library to run the tests on
entry           - Relative path to your compiled index.js
output          - Dictionary that gets applied to the webpack output https://webpack.js.org/configuration/output/
externals       - (optional) Dependencies that should not be bundled, see https://webpack.js.org/guides/author-libraries/#externalize-lodash
module_deps     - (optional) app_lib dependencies on our own typescript libraries (TODO infer this)
"""

def web_library(
        name,
        app_lib,
        entry,
        output,
        externals = {},
        module_deps = []):
    ts_transpiled_sources = name + "_ts_transpiled"

    ts_srcs = [app_lib] + module_deps
    ts_srcs_assets = [get_assets_label(src) for src in ts_srcs]

    native.filegroup(
        name = ts_transpiled_sources,
        srcs = ts_srcs,
        output_group = "es5_sources",
    )

    webpack_config = "//tools/build/web:webpack.library.config.js"

    ts_config = app_lib + "_tsconfig.json"

    args = [
        "$(GENDIR)/" + entry,
        "--config",
        "$(execpath " + webpack_config + ")",
        "--tsconfig",
        "$(location " + ts_config + ")",
        "--outputDict",
        encode_dict(output),
        "--externalDict",
        encode_dict(externals),
        "--path",
        "$(@D)",
    ]

    webpack(
        name = name,
        output_dir = True,
        args = args,
        data = [
           ":" + ts_transpiled_sources,
           webpack_config,
           ts_config,
           "@npm//:node_modules",
        ] +
        ts_srcs_assets,
    )

def encode_dict(output):
    return "|".join([
        setting[0] + "=" + setting[1]
        for setting in output.items()
    ])
