# Contributing

We love every form of contribution. By participating to this project, you
agree to abide to the `Airy` [code of conduct](/code_of_conduct.md).

Please refer to our [developers' manual](/docs/docs/developers-manual.md) to learn
how to build, run, and test the `Airy Core Platform`.

## Test your change

You can create a branch for your changes and try to build from the source as
you go:

```sh
$ bazel build //...
```

When you are satisfied with the changes, we suggest running:

```sh
$ bazel test //...
```

This command runs all the tests.

## Submit a pull request

Push your branch to your `airy` fork and open a pull request against the main
branch.
