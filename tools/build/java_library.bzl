load("@rules_java//java:defs.bzl", "java_library")
load("@com_github_airyhq_bazel_tools//lint:checkstyle.bzl", "checkstyle")

def custom_java_library(**kwargs):
    if "checkstyle" not in native.existing_rules().keys():
        checkstyle()
    java_library(**kwargs)
