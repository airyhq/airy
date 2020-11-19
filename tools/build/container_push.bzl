load("@io_bazel_rules_docker//container:container.bzl", lib_push = "container_push")

tags_to_push = ["release", "latest", "beta"]

def container_push(registry, repository):
    [
        lib_push(
            name = tag,
            format = "Docker",
            image = ":image",
            registry = registry,
            repository = repository,
            tag = tag,
        )
        for tag in tags_to_push
    ]
