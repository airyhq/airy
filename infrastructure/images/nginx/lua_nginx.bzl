load("@io_bazel_rules_docker//container:container.bzl", "container_image")

def lua_nginx(name, tars, **kwargs):
    container_image(
        name = "image",
        base = "//infrastructure/images/nginx:lua-resty",
        tars = tars,
        cmd = [
            "/usr/local/openresty/bin/openresty",
            "-g",
            "daemon off;"
        ],
        **kwargs
    )
