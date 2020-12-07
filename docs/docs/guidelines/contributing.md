---
title: Contributing
sidebar_label: Contributing
---

We ❤️ every form of contribution. The following document aims to provide enough
context to work with our codebase and to open pull requests that follow our
convention. If this document does not provide enough help, open a [new
issue](https://github.com/airyhq/airy/issues/new) and we'll gladly help you get
started.

## Work with the code

The Airy Core Platform uses [Bazel](https://bazel.build/) to build and test
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
  to lint Bazel files
- [prettier](https://prettier.io/) for TypeScript, JavaScript and SCSS
- [CheckStyle](https://checkstyle.sourceforge.io/) for Java

Java and prettier are ran as test targets for each package, so you can run:

```shell script
bazel test //my/package:checkstyle
bazel test //my/package:prettier
```

To execute the buildifier linter run:

```shell script
bazel run //:check
```

You can also run:

```shell script
bazel run //:fix
```

to try fixing issues automatically (not supported for checkstyle).

### Managing dependencies

If you add, remove, or change a dependency from the maven_install, you must
re-pin dependencies using the following command:

```sh
bazel run @unpinned_maven//:pin
```

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

## Naming conventions

In order to organize our releases in the best possible way, we follow a few
critical conventions.

### Branches

Branches must abide to the following format:

`<branch-type>/<issue-number>-<description>`

`branch-type` is defined as follow:

- `feature` or `feat` are used for feature branches
- `bug`, `fix`, `hotfix` are used for bug fixes
- `doc` or `docs` for documentation changes
- `chore` for maintenance tasks on the repo

The `description field` must use kebab case.

Given these conventions here are a few examples:

```
feat/42-the-meaning-of-life
bug/24-say-the-vat-is-good
hotfix/4242-til-json-is-not-a-subset-of-js
```

### Commits

To keep a clean track of what is being released, every feature must contain only
one commit when merged. The commit message of the squashed commit is very
important, since it will be used to keep track of the features in a release.

The conventional format is: `[#issue] - description`. For the example, if your
pull requests refers to the issue "Introduce meaning of life" with number 42,
the squashed commit message must be:

```
[#42] Introduce meaning of life

Fixes #42
```
