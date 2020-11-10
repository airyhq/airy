---
title: Release Process
sidebar_label: Release Process
---

Since the [Airy](https://github.com/airyhq/airy) repository is a mono-repo, the
following document provides guidelines about the release process of the various
projects the repository contains.

## Airy Core Platform

The Airy Core Platform follows a scheduled release process: we release a new
version every two-weeks. This approach allows us to ship smaller releases which
ease the risk of breaking changes and brings new features and bug-fixes to our
users in a timely manner.

Here's an outline of the process:

- We branch from `develop` unless it's a hot-fix (we'd use `main` in that case)
- Once release days comes, we execute the following steps:
  - We create a release branch from `develop`
  - The branch must follow the convention `core/x.y.z`
  - We test our release and any additional hot-fix is committed directly to the release branch
  - Once we're satisfied with the release, we update the `VERSION` file with the current release number
  - We merge the release branch into `main`, tag `main` following the same naming convention and push to `main`
  - We merge the release branch back into `develop`
  - We announce the release!

## NPM libraries

We release new versions of our npm libraries every time we change them. Here's
an outline of the process:

- We branch from `main`
- The branch must follow the convention `npm/library-name/x.y.z`
- We test our feature
- Once we're satisfied with it, we update the `VERSION` file with the current release number
- We merge the release branch into `main`, tag `main` following the same naming convention and push to `main`
- We announce the release!