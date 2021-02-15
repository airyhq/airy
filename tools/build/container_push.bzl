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
        name = "8.1-ci-test",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "8.1-ci-test",
    )

    lib_push(
        name = "release",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "{STABLE_VERSION}",
    )
