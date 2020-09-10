load("//tools/build/web:typescript.bzl", "get_assets_label")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@npm//webpack-cli:index.bzl", webpack = "webpack_cli")

"""
Usage

webapp(
    name = "bundle",
    app_lib = ":app",
    static_assets = "//ui/web/inbox/public",
    entry = "ui/web/inbox/src/index.js",
    index = ":index.html",
    dev_index = ":dev_index.html",
    module_deps = module_deps,
    webpack_prod_config = ":webpack.prod.config.js"
    webpack_dev_config = ":webpack.dev.config.js"
)

parameters:

name            - Unique name of the build rule. The dev server rule will be called name_server
app_lib         - Label of the ts_library to run the tests on
static_assets   - Filegroup (list of files) that should be copied "as is" to the webroot.
                  Files need to be in a folder called 'public' so that we can implicitly infer their purpose
entry           - Relative path to your compiled index.js
index           - index.html file used for the build
dev_index       - (optional) index.html file used for the devserver (defaults to bundle index)
module_deps     - (optional) app_lib dependencies on our own typescript libraries (TODO infer this)

(optional) webpack_prod_config and webpack_dev_config can be used to supply custom dev and prod rules
"""

def webapp(
        name,
        app_lib,
        entry,
        index,
        static_assets,
        module_deps = [],
        dev_index = None,
        webpack_prod_config = None,
        webpack_dev_config = None):
    ts_transpiled_sources = name + "_ts_transpiled"

    ts_srcs = [app_lib] + module_deps
    ts_srcs_assets = [get_assets_label(src) for src in ts_srcs]

    native.filegroup(
        name = ts_transpiled_sources,
        srcs = ts_srcs,
        output_group = "es5_sources",
    )

    webpack_prod_config = "//tools/build/web:webpack.prod.config.js" if not webpack_prod_config else webpack_prod_config
    webpack_dev_config = "//tools/build/web:webpack.dev.config.js" if not webpack_dev_config else webpack_dev_config

    ts_config = app_lib + "_tsconfig.json"

    webpack(
        name = name,
        output_dir = True,
        args = [
            "$(GENDIR)/" + entry,
            "--config",
            "$(execpath " + webpack_prod_config + ")",
            "--tsconfig",
            "$(location " + ts_config + ")",
            "--index",
            "$(location " + index + ")",
            "--path",
            "$(@D)",
        ],
        data = [
                   ":" + ts_transpiled_sources,
                   webpack_prod_config,
                   index,
                   ts_config,
                   "@npm//:node_modules",
                   static_assets,
               ] +
               ts_srcs_assets,
    )

    dev_index = index if not dev_index else dev_index

    nodejs_binary(
        name = name + "_server",
        entry_point = "//tools/build/web:runWebpackDevServer.js",
        args = [
            "--entry",
            entry,
            "--config",
            "$(execpath " + webpack_dev_config + ")",
            "--tsconfig",
            "$(location " + ts_config + ")",
            "--index",
            "$(location " + dev_index + ")",
        ],
        install_source_map_support = False,
        data = [
                   ":" + ts_transpiled_sources,
                   webpack_dev_config,
                   dev_index,
                   ts_config,
                   "@npm//:node_modules",
                   static_assets,
               ] +
               ts_srcs_assets,
        tags = [
            "ibazel_notify_changes",
        ],
    )
