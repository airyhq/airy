---
title: Release Process
sidebar_label: Release Process
---

Airy Core follows a scheduled release process: we release a new version every
week. This approach allows us to ship smaller releases which ease the risk of
breaking changes and brings new features and bug-fixes to our users in a timely
manner.

:::note

The release scripts needs a `GITHUB_TOKEN` environment variable with write
permission to the Airy organization to function correctly

:::

## Standard release

Once a release day comes, we execute the following steps:

- We run `./scripts/release.sh start x.y.z`
- We wait for the release candidate CLI to be pushed and then download it by running:
  - `wget https://airy-core-binaries.s3.amazonaws.com/$VERSION-rc/darwin/amd64/airy`
  - `chmod +x airy`
- We test the release using `./airy create --provider=minikube`. Note that:
  - Any additional hot-fix is committed directly to the release branch
  - You must wait for all the images to be pushed via CI
- We create the draft release which is used for the Changelog `./scripts/release.sh changelog x.y.z`.
- Once we're satisfied with the release, we publish the release:
  - We clean up the draft release. If the upgrade to the new version requires manual steps, we detail them.
  - We run `./scripts/release.sh finish x.y.z`
  - We update the version string to `x.y.z` and the sha to `https://airy-core-binaries.s3.amazonaws.com/x.y.z/darwin/amd64/airy_darwin_sha256sum.txt` in the [Homebrew
    Formula](https://github.com/airyhq/homebrew-airy/blob/main/Formula/cli.rb)
    for the CLI
  - We archive cards in the done column of the [work in progress](https://github.com/airyhq/airy/projects/1) board
  - We publish the release and announce it!

As part of the release process we are also releasing a command line client - the
`Airy CLI`.

You can check out existing releases on
[GitHub](https://github.com/airyhq/airy/releases).

## Hotfix release

In case we need to hotfix a release, we follow a different process. At the
moment, the process is completely manual and goes as follows:

- Create a new branch from `main` called `hotfix/description-of-the-fix`
- Update version file
- Update the changelog
- Test the hotfix
- Merge to `main` _and_ `develop` (do not alter the VERSION file in `develop`)
- Write a custom release draft
- Publish the draft
- Merge the branch to develop while not altering the VERSION file since the
  release script already set it to 0.16.0-alpha
