load("@rules_java//java:defs.bzl", "java_library")
load("//tools/code-format:checkstyle.bzl", "check_pkg")

def custom_java_library(**kwargs):
    check_pkg()
    java_library(**kwargs)
