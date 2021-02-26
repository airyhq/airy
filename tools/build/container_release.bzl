load("@io_bazel_rules_docker//container:container.bzl", "container_push")

def container_release(registry, repository):
    container_push(
        name = "develop",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "develop",
    )

    container_push(
        name = "local",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "{BUILD_USER}",
    )

    container_push(
        name = "release",
        format = "Docker",
        image = ":image",
        registry = registry,
        repository = repository,
        tag = "{STABLE_VERSION}",
    )
