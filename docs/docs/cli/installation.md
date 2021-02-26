---
title: Installation
sidebar_label: Installation
hide_table_of_contents: false
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<TLDR>
Install the CLI quickly with our step-by-step guide or build it from source
</TLDR>

Installing the Airy CLI is easy and straightforward.
You can follow the next steps for a quick setup:

- [Step 1: Check the requirements](installation.md#step-1-check-the-requirements)
- [Step 2: Install the Airy CLI](installation.md#step-2-install-the-airy-cli)
- [Step 3: Verify your installation](installation.md#step-3-verify-your-installation)
- [Step 4: Initialize the setup](installation.md#step-4-initialize-the-setup)

### Step 1: Check the requirements

Airy is built to run in the cloud, but you can also run it locally. The CLI runs
on macOS, Linux and Windows and we provide pre-built executable binaries for
**x86-64**.

If you are running on a different platform you can also [build it
yourself](installation.md#building-from-source).

### Step 2: Install the Airy CLI

#### Download the latest release

<Tabs
groupId="operating-systems"
defaultValue="homebrew"
values={[
{label: 'Homebrew', value: 'homebrew'},
{label: 'macOS', value: 'mac'},
{label: 'Linux', value: 'linux'},
]
}>
<TabItem value="mac">

```bash
curl "https://airy-core-binaries.s3.amazonaws.com/$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)/darwin/amd64/airy" -o "airy"
```

and make it executable

```bash
chmod +x ./airy
```

:::note

To download a specific version, replace the `$(curl -L -s <URL>)` portion of the
command with the specific version.

For example, to download version 0.6.0 on macOS, type:

curl https://airy-core-binaries.s3.amazonaws.com/0.6.0/darwin/amd64/airy -o "airy"
:::
</TabItem>

<TabItem value="homebrew">

Make sure you have the [Xcode Command Line
Tools](https://developer.apple.com/library/archive/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-WHAT_IS_THE_COMMAND_LINE_TOOLS_PACKAGE_)
installed. Otherwise you can install them with:

```bash
xcode-select --install
```

Now you can get the CLI straight from our tap:

```bash
brew install airyhq/airy/cli
```

</TabItem>

<TabItem value="linux">

```bash
curl -LO "https://airy-core-binaries.s3.amazonaws.com/$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)/linux/amd64/airy" -o "airy"
```

:::note

To download a specific version, replace the `$(curl -L -s <URL>)` portion of the
command with the specific version.

For example, to download version 0.6.0 on Linux, type:

curl https://airy-core-binaries.s3.amazonaws.com/0.6.0/linux/amd64/airy -o "airy"
:::
</TabItem>
</Tabs>

<Tabs
groupId="operating-systems"
defaultValue="homebrew"
values={[
{label: 'Homebrew', value: 'homebrew'},
{label: 'macOS', value: 'mac'},
{label: 'Linux', value: 'linux'},
]
}>

<TabItem value="mac">

#### Move the **airy** binary to a file location on your system PATH

```
sudo mv ./airy /usr/local/bin/airy && \
sudo chown root: /usr/local/bin/airy
```

</TabItem>

<TabItem value="linux">

#### Install the binary

```bash
sudo install -o root -g root -m 0755 airy /usr/local/bin/airy
```

</TabItem>
<TabItem value="homebrew">

</TabItem>
</Tabs>

### Step 3: Verify your installation

Make sure the output matches the version number you expect:

```bash
airy version
```

### Step 4: Initialize the setup

The [airy init](cli/reference.md#init) will create a `cli.yaml` file which stores
your `apiHost` and `apiJwtToken`:

```bash
airy init
```

<SuccessBox>

:tada: Congratulations!

You have successfully installed Airy CLI! Next step: Choose a way to [Deploy
Airy Core](/getting-started/installation/introduction.md)

</SuccessBox>

## Building from source

1. Build the cli target with Bazel:

```bash
bazel build //infrastructure/cli:airy
```

2. Move the **airy** binary to a file location on your system PATH.

```bash
sudo cp bazel-out/darwin-fastbuild/bin/infrastructure/cli/airy /usr/local/bin/airy
```
