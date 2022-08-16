---
title: Contributing to Airy
sidebar_label: Contributing to Airy
---

We ❤️ every form of contribution. The following document aims to provide enough
context to work with our codebase and to open pull requests that follow our
conventions. If this document does not provide enough help, open a [new
issue](https://github.com/airyhq/airy/issues/new) and we'll gladly help you get
started.

## Work with the code

Airy Core uses [Bazel](https://bazel.build/) to build and test
itself. We suggest you to install
[bazelisk](https://github.com/bazelbuild/bazelisk), a small utility that will
install the right version of Bazel for you.

### Build

You can build the whole platform using the following command:

```sh
bazel build //...
```

and build a specific project like so:

```sh
bazel build //backend/api/communication:all
```

### Test

To run tests, execute the following command:

```sh
bazel test //...
```

You can also run tests of a specific project like so:

```sh
bazel test //backend/conversations/api/communication:all
```

### Lint

You can lint the entire code base by executing the `./scripts/lint.sh` script.

We use language specific linters:

- [buildifier](https://github.com/bazelbuild/buildtools/tree/master/buildifier)
  to lint Bazel Starlark files
- [prettier](https://prettier.io/) for TypeScript, JavaScript and SCSS
- [CheckStyle](https://checkstyle.sourceforge.io/) for Java

Java, buildifier, and prettier are run as test targets for each package, so you can run:

```shell script
bazel test //my/package:checkstyle
bazel test //my/package:prettier
bazel test //my/package:buildifier
```

You can also run:

```shell script
bazel run //:fix
```

to try fixing issues automatically (not supported for checkstyle).

### Managing Java dependencies

If you add, remove, or change a dependency from the `repositories.bzl`, you must
re-pin dependencies using the following command:

```sh
REPIN=1 bazel run @unpinned_maven//:pin
```

### Working with golang

We use [Gazelle](https://github.com/bazelbuild/bazel-gazelle) to manage golang based projects and dependencies in our code.
Gazelle allows you to work within a projects directory as if it were a regular golang project.
After changing code or adding/removing dependencies you have to run `bazel run //:gazelle` in order to update the project's `BUILD` files.

#### Updating dependencies

One essential advantage of mono repositories is that they allow you to deliver one version of each external dependency across the entire company.
This is however outside the scope of Gazelle which only takes care of syncing build files and does not take into account a global dependency structure.
Therefore, if you updated a subproject's `go.mod` file you need to run a custom tool that we built in order to perform the merge:

```sh
bazel run //tools/update-deps
```

You can learn more about how it works [here](https://github.com/airyhq/airy/tree/main/tools/update-deps).

#### Troubleshooting

The `update-deps` tool uses gazelle to update the global `go_repositories.bzl` file adding one [`go_repository` rule](https://github.com/bazelbuild/bazel-gazelle/blob/master/repository.md#go_repository) for each dependency.
When encountering a build issue you can go through the following steps to try to solve it:

1. Use community resources: [Gazelle docs](https://github.com/bazelbuild/bazel-gazelle), [Golang module docs](https://go.dev/ref/mod), the #go channel of the [Bazel slack](https://slack.bazel.build/)
2. Each dependency has an `importpath` that needs to be unique, e.g. `sigs.k8s.io/json`. If there is a build conflict within the dependencies it is likely that some dependency is out of date and brings in a sub-dependency with a conflicting import path.
3. Load order: Bazel reads the `WORKSPACE` file in a sequential manner. That means if some rule is loaded before our call to `go_repositories()` it would overwrite the version of a go module that we are trying to load. This behavior is improved in Bazel's [new module system](https://bazel.build/docs/bzlmod).
4. Use `go mod graph` to understand who is bringing in a dependency. This can be useful to understanding why a troublesome dependency is imported and how to update it.
5. Check that the `build_file_proto_mode` is set to `disable_global` for the dependency that is causing the issue. It is currently set to this value by default when running the `update-deps` tool, but Gazelle is capable of tracking some custom changes that you make to this file.

### Exploring the code base

Bazel has an extensive [query
language](https://docs.bazel.build/versions/master/query.html) you can use to
dig deeper into projects. Here are a few examples:

```sh
# show all deps of a given project
bazel query "deps(//backend/api/conversations:all)" --output label

# show the available tests of a given project
bazel query "tests(//backend/api/conversations:all)" --output label

# show all the packages under a specific path
bazel query "backend/..." --output package
```

If you are not familiar with a specific project, you can also run the following
query:

```sh
bazel query "backend/..."
```

The query shows all the targets produced under that specified package. It can
help getting started.

Bazel also offers a friendly and powerful autocompletion, please refer to [this
document](https://github.com/bazelbuild/bazel/blob/master/site/docs/completion.md)
to install it locally.

### Publishing and running images locally

You can test your images locally at runtime if you have a local instance of Airy
Core running in Minikube.

#### Publish image to minikube's registry

In order for the Airy Core cluster to have access to a newly built image, you need
to publish the image to Minikube's (built-in) docker registry. Do this by pointing
your shell's docker environment to the docker instance in minikube:

```sh
eval $(minikube -p airy-core docker-env)
```

Next, create an image with bazel, which will automatically load the image into
Minikube's registry. For example:

```sh
bazel run //backend/api/communication:image
```

You can verify this action with `docker images` and you can restore the shell
environment to point to your local docker instance with
`eval $(minikube -p airy-core docker-env -u)`.

#### Run image on Airy Core

Next, you will want to run this image in the Airy Core cluster. For this example
that means you need to:

```sh
kubectl patch deployment api-communication -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","image":"bazel/backend/api/communication:image","imagePullPolicy":"Never"}]}}}}'
```

Once this is done, the image will be up and running in your local cluster.

## Naming conventions

In order to organize our releases in the best possible way, we follow a few
critical conventions.

### Branches

Branches must abide to the following format:

`<branch-type>/<issue-number>-<description>`

`branch-type` is defined as follows:

- `feature` or `feat` are used for feature branches
- `bug`, `fix`, `hotfix` are used for bug fixes
- `enhancement` is used for improvements of existing features
- `doc` or `docs` are used for documentation changes
- `chore` is used for maintenance tasks on the repo

The `description field` must use kebab case.

Given these conventions here are a few examples:

```
feat/42-the-meaning-of-life
bug/24-say-the-vat-is-good
hotfix/4242-til-json-is-not-a-subset-of-js
enhancement/3333-speed-up-airy-instance-creation
```

### Commits

To keep a clean track of what is being released, every feature must contain only
one commit when merged. The commit message of the squashed commit is very
important, since it will be used to keep track of the features in a release.

The conventional format is: `[#issue] Description` (`Description` must start with a capital letter). For the example, if your
pull request refers to the issue "Introduce meaning of life" with number 42,
the squashed commit message must be:

```
[#42] Introduce meaning of life

Fixes #42
```
