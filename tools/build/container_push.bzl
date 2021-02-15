load("@io_bazel_rules_docker//container:container.bzl", lib_push = "container_push")

def container_push(registry, repository):
    lib_push(
        name = "develop",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "develop",
    )

    lib_push(
        name = "ljupco-test-ci",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "ljupco-test-ci",
    )

    lib_push(
        name = "local",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "{BUILD_USER}",
    )

    lib_push(
        name = "release",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "{STABLE_VERSION}",
    )
