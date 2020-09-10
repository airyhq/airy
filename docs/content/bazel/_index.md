---
title: Bazel
---

[bazel](https://bazel.build/) is the build tool of choice to build and test the Airy Core Platform.

- [Build](#build)
- [Test](#test)
- [Maven dependencies](#maven-dependencies)
- [Query language](#query-language)

## Build

You can build all the projects using the following command:

```sh
$ bazel build //...
```

You can also build a specific project like so:

```sh
$ bazel build //conversations/api/conversations:all
```

You can run tests using the following command:

## Test

```sh
$ bazel test //...
```

You can also run tests of a specific project like so:

```sh
$ bazel test //conversations/api/conversations:all
```

For running web server targets with cold and hot reloading, you have to
install ibazel (https://github.com/bazelbuild/bazel-watcher). Then you can run
the webpack devserver like so:

```sh
$ ibazel run //ui/web/admin:app-bundle-dev_server
```

## Maven dependencies

As we lock our dependencies, every time we add or remove a dependency from the
maven_install we need to repin dependencies using the following command:

```sh
$ bazel run @unpinned_maven//:pin
```

## Query language

Bazel has an extensive [query
language](https://docs.bazel.build/versions/master/query.html) you can use to
dig deeper into projects. Here are a few examples:

```sh
$ # show all deps of a given project
$ bazel query "deps(//conversations//..)" --output label
$
$ # show the available tests of a given project
$ bazel query "tests(//conversations:all)" --output label
$
$ # show all the packages under a specific path
$ bazel query "api/..." --output package
```

If you are not familiar with a specific project, you can also run the following
query:

```sh
$ bazel query "api/..."
```

The query shows all the targets produced under that specified package. It can
help getting started.

Bazel also offers a friendly and powerful autocompletion, please refer to [this
document](https://github.com/bazelbuild/bazel/blob/master/site/docs/completion.md)
to install it locally.
