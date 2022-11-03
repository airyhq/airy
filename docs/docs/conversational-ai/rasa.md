---
title: Rasa Open Source
sidebar_label: Rasa Open Source
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

With over 25 million downloads, Rasa Open Source is the most popular open source framework for building chat and voice-based AI assistants.

- From the [Rasa documentation](https://rasa.com/docs/rasa/)

</TLDR>

Integrating [Rasa Open Source](https://rasa.com/docs/rasa/) with your Airy Core instance enables you to leverage its conversational AI capabilities on all your instance's [channels](getting-started/glossary.md#channel).

When [Rasa Open Source](https://rasa.com/docs/rasa/) is integrated with an Airy Core instance, Airy Core will forward the messages to the [Rasa Open Source](https://rasa.com/docs/rasa/) installation, which will respond to the Airy Core API according to its conversation flow.

:::tip What you will learn

- Setting your credentials on your Rasa project
- How to connect Rasa to Airy Core

:::

:::note Prerequisites

- A running Airy Core installation (refer to the [Get
  Started section](getting-started/installation/introduction.md))

:::

## Step 1: Install Rasa Open Source

The first step is to install Rasa Open Source and [creating a new project](https://rasa.com/docs/rasa/command-line-interface#rasa-init): follow the instructions from the [Rasa documentation](https://rasa.com/docs/rasa/installation/installing-rasa-open-source).

## Step 2: Set up your credentials in your project

Connecting [Rasa Open Source](https://rasa.com/docs/rasa/) to Airy Core requires one configuration value: a `Rest webhook URL`, which is made of your instance's URL appended with `/webhooks/rest/webhook` (for example: "https://123.eu.ngrok.io/webhooks/rest/webhook").

In the Rasa project you created in the previous step, add your Rest webhook URL in the `credentials.yml` file, below `rest`.

For example:

```yml
rest:
  webhook_url: "https://123.eu.ngrok.io/webhooks/rest/webhook"
```

<SuccessBox>

Congratulations! You are now ready to connect Rasa to your Airy Core instance 🎉

</SuccessBox>
<br />

import InstallationOptions from './installation-options.mdx'

<InstallationOptions />

## Step 2 (option 1): Installation and configuration via API request

First, you need to install the component on your instance: send an API request to the [Components Install](/api/endpoints/components#install) endpoint to install the [Rasa Open Source](https://rasa.com/docs/rasa/) on your Airy instance.

The request body should be:

```json
{
  "name": "rasa-connector"
}
```

Once the installation is successful (indicated by a 200 response status code), you can configure the component using the [Components Update](/api/endpoints/components#update) endpoint.

Configuring the Rasa connector on your Airy Core instance only requires your instance's URL, without any trailing slashed at the end (Airy Core's backend automatically appends `/webhooks/rest/webhook` to the URL you provide).

```json
{
  "components": [
    {
      "name": "rasa-connector",
      "enabled": true,
      "data": {
        //your instance's URL without trailing slashes
        //(example: https://123.eu.ngrok.io)
        "rasaWebhookUrl": "yourInstanceURL"
      }
    }
  ]
}
```

The request is considered successful if the component's name (in this case:`rasa-connector`) is returned in the response.

```json
{
  "components": {
    "rasa-connector": true
  }
}
```

The [Rasa Open Source](https://rasa.com/docs/rasa/) is now installed and configured on your Airy Core instance.

## Step 2 (option 2): Installation and configuration via the Airy Control Center UI

On the [Airy Control Center UI](/ui/control-center/introduction), navigate to the [Catalog](/ui/control-center/catalog) and select `Rasa`. Click on the `Install` button.

Once the installation is completed, navigate to the [Control Center's Connectors page](/ui/control-center/connectors) and select `Rasa`: this will open the Rasa connector configuration page.

Configuring the Rasa connector on your Airy Core instance only requires your instance's URL, without any trailing slashed at the end (Airy Core's backend automatically appends `/webhooks/rest/webhook` to the URL you provide).

On the configuration page, paste your instance's URL in the respective input and save.

The [Rasa Open Source](https://rasa.com/docs/rasa/) is now installed and configured on your Airy Core instance.

## Step 3: Rasa's connection with Airy

[Start your rasa server from your Rasa project](https://rasa.com/docs/rasa/command-line-interface#rasa-run) you created in step 1 (make sure you run the command from your project's folder, `cd` into it if needed):

```json
rasa run --enable-api
```

To test the connection, write a message to one of your channels: Airy Core will
forward it to your [Rasa Open Source](https://rasa.com/docs/rasa/) installation, which will respond to the Airy Core API according to its conversation flow.

The screenshot below displays an [Airy Live Chat Plugin](/sources/chatplugin/overview) from an Airy instance connected to [Rasa Open Source](https://rasa.com/docs/rasa/). It shows an example where a message sent to Airy Core is responded to by a [Rasa Open Source](https://rasa.com/docs/rasa/) installation.

<center><img alt="Airy connection with Rasa " src={useBaseUrl('img/conversational-ai/rasa/messagingExample.png')} /></center>
