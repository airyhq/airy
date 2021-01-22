load("@io_bazel_rules_docker//docker/util:run.bzl", "container_run_and_commit")

container_run_and_commit(
    name = "lua-resty",
    commands = [
        "opm get bungle/lua-resty-template",
    ],
    image = "@nginx_base//image",
    visibility = ["//visibility:public"],
)
