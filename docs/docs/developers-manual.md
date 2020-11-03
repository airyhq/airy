---
id: developers-manual
title: Developers' Manual
sidebar_label: Developers' Manual
slug: /developers-manual
---

The Airy Core Platform uses [Bazel](https://bazel.build/) to build and test
itself. We suggest you to install
[bazelisk](https://github.com/bazelbuild/bazelisk), a small utility that will
install the right version of Bazel for you.

## Build

You can build the whole platform using the following command:

```sh
$ bazel build //...
```

and build a specific project like so:

```sh
$ bazel build //backend/api/conversations:all
```

To run all test tests, execute the following command:

## Test

```sh
$ bazel test //...
```

You can also run tests of a specific project like so:

```sh
$ bazel test //conversations/api/conversations:all
```

## Managing maven dependencies

If you add, remove, or change a dependency from the maven_install, you must
re-pin dependencies using the following command:

```sh
$ bazel run @unpinned_maven//:pin
```

## Exploring the code base

Bazel has an extensive [query
language](https://docs.bazel.build/versions/master/query.html) you can use to
dig deeper into projects. Here are a few examples:

```sh
$ # show all deps of a given project
$ bazel query "deps(//backend/api/conversations:all)" --output label
$
$ # show the available tests of a given project
$ bazel query "tests(//backend/api/conversations:all)" --output label
$
$ # show all the packages under a specific path
$ bazel query "backend/..." --output package
```

If you are not familiar with a specific project, you can also run the following
query:

```sh
$ bazel query "backend/..."
```

The query shows all the targets produced under that specified package. It can
help getting started.

Bazel also offers a friendly and powerful autocompletion, please refer to [this
document](https://github.com/bazelbuild/bazel/blob/master/site/docs/completion.md)
to install it locally.
