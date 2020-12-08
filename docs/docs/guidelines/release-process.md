---
title: Release Process
sidebar_label: Release Process
---

The Airy Core Platform follows a scheduled release process: we release a new
version every two-weeks. This approach allows us to ship smaller releases which
ease the risk of breaking changes and brings new features and bug-fixes to our
users in a timely manner.

Here's an outline of the process:

- We branch from `develop` unless it's a hot-fix (we'd use `main` in that case)
- Once release days comes, we execute the following steps:
  - We create an issue "Release x.y.z"
  - We create a release branch `release/x.y.z` from the latest `develop` and push it:
    - `git checkout develop`
    - `git pull origin develop`
    - `git checkout -b release/x.y.z`
    - `git push origin release/x.y.z`
  - We test our release (`AIRY_VERSION=release ./scripts/bootstrap.sh`) and any
    additional hot-fix is committed directly to the release branch
  - Once we're satisfied with the release, we update the `VERSION` file with the
    current release number. The commit message must be `Fixes #issue-number`
    where `issue-number` is the number of the current release issue
  - We merge the release branch into `main`, tag `main` with `x.y.z`and push to `main`:
    - `git checkout main`
    - `git pull origin main`
    - `git merge release/x.y.z`
    - `git tag x.y.z`
    - `git push origin main`
    - `git push origin x.y.z`
  - We merge the release branch back into `develop`:
    - `git checkout develop`
    - `git merge release/x.y.z`
    - `git push origin develop`
  - We archive cards in the done column of the [work in progress](https://github.com/airyhq/airy/projects/1) board
  - We rename the current draft release to `x.y.z` and publish it
  - We announce the release!

You can check out existing releases on [GitHub](https://github.com/airyhq/airy/releases).
