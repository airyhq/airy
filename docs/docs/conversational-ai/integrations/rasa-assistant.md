---
title: Rasa Chat Assistant
sidebar_label: Rasa Assistant
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>

Rasa is an open-source machine learning framework for automated text and voice-based conversations. Understand messages, hold conversations, and connect to messaging channels and APIs.

\- From the [Rasa documentation](https://rasa.com/docs/rasa/)

</TLDR>

:::tip What you will learn

- How to forward Airy Core messages to Rasa
- How to configure Rasa to receive and reply to messages using Airy

:::

Out of the box Rasa offers you a standard set of messaging channels to connect
to. However, you can only connect to one Facebook page at a time.
This is perfectly fine for simple use cases, but as your platform grows and you
want to scale your bot interactions across many channels you will need a
dedicated solution for storing and routing messages.

This is where Airy Core can provide great scale benefits: You can connect a wide
array of messaging channels and service them in a single inbox. For Rasa, you
can think of it as a forward messaging router that will persist your data and
make it available for export to anywhere within your organization.

This guide covers how to configure your Rasa installation so that it can use
Airy Core to send and receive messages.

:::note Prerequisites

- A running Airy Core installation [Get
  Started](getting-started/installation/introduction.md)
- A local Rasa setup: For convenience, we recommend [the Docker setup](https://rasa.com/docs/rasa/docker/building-in-docker/) or [the demo repository](https://github.com/airyhq/rasa-demo) we created for this guide

:::

## Configuring Airy

Airy Core can forward messages from your sources (Messenger, WhatsApp etc.) to
downstream messaging frameworks like Rasa, which can in turn reply using the
Airy Core API.

To do this we follow the [webhook documentation](api/webhook.md) to forward in-
and outbound messages to Rasa. When doing so, set the `url` parameter so that it
points to your Rasa installation. If your Airy Core instance is running locally you can obtain a
public URL by using [ngrok](https://ngrok.com/). Run:

```shell script
ngrok http 5005
```

to get an ngrok URL that points to your local Rasa installation at
`localhost:5005`. With the public ngrok URL your webhook subscription payload
should look like so:

```json
{
  "url": "https://e3effaceb9c5.ngrok.io/webhooks/airy/webhook"
}
```

Once you have done this, the Airy Core will start sending messages to the URL
you specified.

<img alt="successful webhook connection log" src={useBaseUrl('img/integrations/rasa/webhook_success.jpg')} />

## Configuring Rasa

We will be implementing a [custom
connector](https://rasa.com/docs/rasa/connectors/custom-connectors/) as we want
to make use of the Airy Core API.

The first step is to create a new directory `channels/` in our Rasa project and
copy this [connector
file](https://github.com/airyhq/rasa-demo/blob/main/channels/airy.py) into it.
The connector requires the following configuration values:

- `system_token` is the Airy Core system token used for authenticating with the API.
- `api_host` is the URL where you host your Airy Core API.

Add the configuration values to your existing Rasa `credentials.yml`:

```yaml
channels.airy.AiryInput:
  api_host: "http://localhost"
  system_token: "the system api token for Airy Core"
```

Now you should have a working integration 🎉.

To test the connection write a message to one of your channels: Airy Core will
forward it to your Rasa installation, which will respond using the Airy Core
API. This is what you should see in the logs of the demo repository:

<img alt="send message successful connection log"
src={useBaseUrl('img/integrations/rasa/success.jpg')} />
