---
title: How to connect the Airy Core Platform to Rasa 
sidebar_label: Connecting Rasa
---

> Rasa is an open source machine learning framework for automated text and voice-based conversations. 
> Understand messages, hold conversations, and connect to messaging channels and APIs.
>
> \- From the [Rasa documentation](https://rasa.com/docs/rasa/)


This guide covers how to configure your Rasa installation so that it
can use the Airy Core Platform to send and receive messages.

  
## Requirements

- A running Airy Core Platform installation [[Get Started](index.md#bootstrapping-the-airy-core-platform)]
- A local Rasa setup: For convenience, we recommend the Docker one [[Guide](https://rasa.com/docs/rasa/docker/building-in-docker/ )] or [a demo repository](https://github.com/airyhq/rasa-demo) we created for this guide

## Configuring Airy

In this scenario the Airy Core Platform works like a message router: It receives
messages from your sources (Messenger, WhatsApp etc.) and forwards them to downstream messaging frameworks like Rasa, which can in turn reply using the Airy Core Platform.

To do this we follow the [Webhook documentation](api/webhook.md) to forward in- and
outbound messages to Rasa. When doing so set the `url` parameter
so that it points to your Rasa installation. If it is running locally you can obtain
a public url by using [ngrok](https://ngrok.com/). Run: 

```shell script
ngrok http 5005
```

to get an ngrok URL that points to your local Rasa installation at `localhost:5005`.
With the public ngrok url your Webhook subscription payload should look like so:

```json
{
  "url": "https://e3effaceb9c5.ngrok.io/webhooks/airy/webhook"
}
``` 

Once you have done this, the Airy Core Platform will start sending messages to the
url you specified.

## Configuring Rasa

We will be implementing a
[custom connector](https://rasa.com/docs/rasa/connectors/custom-connectors/) as we want to make use of the Airy Core Platform API.

The first step is to create a new directory `channels/` in our Rasa project and copy this
[connector file](https://github.com/airyhq/rasa-demo/blob/master/channels/airy.py) into it. The connector requires the following configuration values: 

- `auth_token`  the Airy Core Platform JWT token you used
                to connect the webhook.
- `api_host`    The url where you host your Airy Core Platform API (`http://api.airy` for a local installation).

Add them to your existing Rasa `credentials.yml`:

```yaml
channels.airy.AiryInput:
  api_host: "your JWT authentication token"
  auth_token: "http://api.airy"
``` 

Now you should have a working integration 🎉 . To test the connection write a message to one of the sources
recognized by your Rasa model.
