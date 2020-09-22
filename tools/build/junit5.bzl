load("@rules_java//java:defs.bzl", "java_test")

def junit5(file, size = "small", deps = [], data = [], resources = []):
    all_deps = [
        "@maven//:org_junit_jupiter_junit_jupiter_api",
        "@maven//:org_junit_jupiter_junit_jupiter_params",
        "@maven//:org_junit_jupiter_junit_jupiter_engine",
        "@maven//:org_hamcrest_hamcrest",
        "@maven//:org_hamcrest_hamcrest_library",
        "@maven//:org_mockito_mockito_core",
        "@maven//:com_jayway_jsonpath_json_path",
    ]
    for dep in deps:
        all_deps.append(dep)

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
        deps = all_deps,
        data = data,
        resources = resources,
        runtime_deps = [
            "@maven//:org_junit_platform_junit_platform_console",
        ],
    )
