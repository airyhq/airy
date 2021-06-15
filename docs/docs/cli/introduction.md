---
title: Install the Airy CLI
sidebar_label: Introduction
hide_table_of_contents: false
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<TLDR>

The Airy CLI is a developer tool to help you **build**, **test**, and **manage**
Airy Core instances directly from your terminal.

</TLDR>

import Script from "@site/src/components/Script";

<Script data-cols="120" data-rows="32" id="asciicast-403849" src="https://asciinema.org/a/403849.js"></Script>

Installing the Airy CLI is easy and straightforward. You can follow the next
steps for a quick setup:

- [Step 1: Check the requirements](introduction.md#step-1-check-the-requirements)
- [Step 2: Install the Airy CLI](introduction.md#step-2-install-the-airy-cli)
- [Step 3: Verify your installation](introduction.md#step-3-verify-your-installation)

### Step 1: Check the requirements

Airy is built to run in the cloud, but you can also run it locally. The CLI runs
on macOS and Linux and we provide pre-built executable binaries for
**x86-64**.

If you are running on a different platform you can also [build it
yourself](introduction.md#building-from-source).

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

#### Move the **airy** binary to a file location on your system PATH

```
sudo mv ./airy /usr/local/bin/airy && \
sudo chown root: /usr/local/bin/airy
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

#### Install the binary

```bash
sudo install -o root -g root -m 0755 airy /usr/local/bin/airy
```

</TabItem>
</Tabs>

### Step 3: Verify your installation

Make sure the output matches the version number you expect:

```bash
airy version
```

<SuccessBox>

:tada: Congratulations!

You have successfully installed Airy CLI! Next step: Choose a way to [Deploy
Airy Core](/getting-started/installation/introduction#install-airy-core)

</SuccessBox>

## Building from source

1. Build the CLI target with Bazel:

```bash
bazel build //cli:airy
```

2. Move the **airy** binary to a file location on your system PATH.

```bash
sudo cp bazel-out/darwin-fastbuild/bin/cli/airy /usr/local/bin/airy
```
