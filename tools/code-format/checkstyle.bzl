load("@rules_java//java:defs.bzl", "java_test")

def check_style(srcs):
    java_test(
        name = "checkstyle",
        args = [
            "-c $(location //:checkstyle.xml)",
            "./",
        ],
        size = "small",
        use_testrunner = False,
        main_class = "com.puppycrawl.tools.checkstyle.Main",
        data = [
            "//:checkstyle.xml",
        ] + srcs,
        runtime_deps = [
            "@maven//:com_puppycrawl_tools_checkstyle",
        ],
    )

# Add code style checking to all java files in package if not already defined
def check_pkg():
    existing_rules = native.existing_rules().keys()
    if "checkstyle" not in existing_rules:
        check_style(native.glob(["**/*.java"]))
