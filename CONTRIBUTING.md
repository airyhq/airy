# Contributing

We love every form of contribution. By participating to this project, you
agree to abide to the `Airy` [code of conduct](/code_of_conduct.md).

Please refer to our [developers' manual](/docs/docs/developers-manual.md) to
learn how to build, run, and test the `Airy Core Platform`.

## Open an issue

We track our development on Github using
[issues](https://github.com/airyhq/airy/issues), so every pull request must
refer to an issue.

## Label the issue

We use labels to help track the development. If possible, label your issue as
soon as it is created.

## Branches

Feature branches must start with `feature/*`, have the issue number and a
description.  If for example the issue is named "Introduce meaning of life" and its
issue number 42, a good name would be:

`feature/42-introduce-meaning-of-life`

Hotfix branches must start with `hotfix/*`, have the issue number and a
description as well. If for example the issue is named "Fix missing
life meaning" and its number is 4242, the branch name will be

`hotfix/4242-fix-missing-life-meaning`

## Commits

You can push as many commits we need to finish a feature.

## Lint your changes

We use language specific linters: [buildifier](https://github.com/bazelbuild/buildtools/tree/master/buildifier) to lint Bazel files, [prettier](https://prettier.io/) for TypeScript, JavaScript and SCSS, [CheckStyle](https://checkstyle.sourceforge.io/) for Java.

Java linting is run as a test, so depending on the package you can run:

```sh
bazel test //my/package:checkstyle
```

to have Bazel check your Java code for linting errors.

Buildifier and Prettier are bundled up in a single Bazel command. So you can run:

```sh
bazel run //:check
```

to check your code and:

```sh
bazel run //:fix
```

to try fixing linting issues automatically.

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

To keep a clean track of what is being released, every feature must contain
only one commit when merged.  The commit message of the squashed commit is
very important, since it will be used to keep track of the features in a
release.

The convention is [#issue] - description, for the example issue "Introduce
meaning of life" with number 42, the squashed commit message would be

`[#42] - Introduce meaning of life`

## Submitting

When opening a Pull Request, make sure that:

- Tests are passing
- Code is linted
- Description references the issue
- Branch name follows the convention previously described
- Commits are squashed
