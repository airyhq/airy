# Contributing

We love every form of contribution. By participating to this project, you
agree to abide to the `Airy` [code of conduct](/code_of_conduct.md).

Please refer to our [developers' manual](/docs/docs/developers-manual.md) to learn
how to build, run, and test the `Airy Core Platform`.


## Open an issue

We track our development on Github using [issues](https://github.com/airyhq/airy/issues), so every Pull Request
that is opened should refer to an issue.


## Label the issue

We use labels to help track the development. If possible, label your issue as soon as it is created.

## Branches

Feature branches must start with `feature/*`, have the issue number and a description.
If for example the issue is named "Map message content" and it's issue number 216, a good name would be

`feature/216-map-message-content`

## Commits

You can push as many commits we need to finish a feature.

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

## Squashing your commits

To keep a clean track of what is being released, every feature must contain only one commit when merged.
The commit message of the squashed commit is very important, since it will be used to keep track of the features in a release.

The convention is [#issue - description], for the example issue "Map message content" with number 216, the squashed commit message would be

`[#216 - Map message content]`

## Submitting

When opening a Pull Request, make sure that 

- Tests are passing
- Code is linted
- Description references the issue
- Branch name follows the convention previously described
- Commits are squashed



