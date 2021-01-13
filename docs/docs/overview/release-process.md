---
title: Release Process
sidebar_label: Release Process
---

The Airy Core Platform follows a scheduled release process: we release a new
version every two-weeks. This approach allows us to ship smaller releases which
ease the risk of breaking changes and brings new features and bug-fixes to our
users in a timely manner.

Here's an outline of the process:

- We need a `GITHUB_TOKEN` environment variable with write permission to the org
- We run `./scripts/release.sh start x.y.z`
- Once release days comes, we execute the following steps:
  - We test our release (`./scripts/bootstrap.sh`) and any
    additional hot-fix is committed directly to the release branch
  - Once we're satisfied with the release, we finish the release by running `./scripts/release.sh finish x.y.z`
  - We archive cards in the done column of the [work in progress](https://github.com/airyhq/airy/projects/1) board
  - We rename the current draft release to `x.y.z` and publish it
  - We announce the release!

You can check out existing releases on [GitHub](https://github.com/airyhq/airy/releases).
