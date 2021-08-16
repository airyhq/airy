---
title: Upgrade your Airy Core instance
sidebar_label: Upgrade
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Upgrade an existing installation of Airy Core.

</TLDR>

## Upgrade your CLI

In order to upgrade your Airy Core instance, first you need to upgrade your Airy CLI, depending on your [installation method](/cli/introduction#step-2-install-the-airy-cli).

You can check the current version of your Airy CLI with the `airy version` command:

```
airy version
Version: 0.29.0, GitCommit: b47d7e46c884a45c4c2169f626ebd0ff9ff6ee8e
```

## Upgrade your Airy Core instance

:::warning

The upgrade of your Airy Core cluster will lead to downtime. Usually it takes seconds, but in case there is a migration or a reset of some of the streaming apps, this process might take longer, depending on the amount of data you have.

For more information about specific upgrades, or if you have any questions, please join the [Airy Developers Community on Slack](https://airy-developers.slack.com/).

:::

Use the `airy upgrade` command to perform the upgrade of your Airy Core instance. Run `airy upgrade` to return information about your current Airy Core version and the latest version available. You will be prompted to proceed with the upgrade (omit this prompt by using the `--approve` flag).

```sh
$ airy upgrade
CLI version:  0.29.0
Current Airy Core version:  0.28.0
New Airy Core version:  0.29.0

Are you sure that you want to proceed? [Y/y]
Y
```

:::note

You need to be inside an Airy Core workspace directory to run the command.

You can overwrite the path by specifying the `--workspace` flag, for example:

`airy upgrade --workspace ~/.airy/production`.

:::

The upgrade will continue until complete. You will receive a notification to confirm that the upgrade was successful. The version will be updated inside the Kubernetes cluster and in your local `airy.yaml` file.

```
Upgrading the helm charts of Airy Core...
Applying config from the configuration file.
applied configuration for "security"
Writing the new version into the configuration file.
Copying the configuration file in the Airy Core K8s cluster.

✅ Aity Core upgraded
```

## Troubleshooting

The upgrade process will not delete any of the persistent data that is kept inside the Kafka cluster. If for any reason an upgrade fails, a rollback to your previous Airy Core version will be initiated.

If you need further help, refer to our [Troubleshooting section](/getting-started/troubleshooting).
