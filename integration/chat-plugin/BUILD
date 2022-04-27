load("@com_github_airyhq_bazel_tools//web:typescript.bzl", "ts_web_library")
load("@com_github_airyhq_bazel_tools//lint:buildifier.bzl", "check_pkg")

check_pkg(name = "buildifier")

package(default_visibility = ["//visibility:public"])

ts_web_library(
    name = "chat-plugin",
    srcs = glob(["*.spec.ts"]),
    tsconfig = {
        "compilerOptions": {
            "lib": [
                "esnext",
                "dom",
            ],
            "types": ["cypress"],
        },
    },
    deps = [
        "//frontend/chat-plugin/handles:chat-plugin-handles",
        "//frontend/inbox/handles",
        "@npm//cypress",
    ],
)
