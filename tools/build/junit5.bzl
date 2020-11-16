load("@rules_java//java:defs.bzl", "java_test")

def junit5(file, size = "small", deps = [], data = [], resources = []):
    java_test(
        # Remove src/test/java/ prefix and java suffix
        name = file[14:-5].replace("/", "."),
        main_class = "org.junit.platform.console.ConsoleLauncher",
        use_testrunner = False,
        size = size,
        args = [
            "--select-class %s" % file[14:-5].replace("/", "."),
            "--fail-if-no-tests",
        ],
        srcs = [
            "%s" % file,
        ],
        deps = deps,
        data = data,
        resources = resources,
        runtime_deps = [
            "@maven//:org_junit_platform_junit_platform_console",
        ],
    )
