---
title: Facebook
sidebar_label: Facebook
---

## Introduction

The Facebook source provides a channel of communication between a Facebook page and your running instance of the Airy Core Platform.

When connecting a channel via the [/channels.connect](api/http.md#connecting-channels), you must set the `source` field `facebook` and the `token` field to a valid Facebook user access token

## Configuration

For Facebook to start sending events to your local instance, it must first verify your instance with a challenge.
The only configuration needed for that to happen is to set the environment variable `FB_WEBHOOK_SECRET` with the provided token
by Facebook.

You must also configure the webhook URL to `https://<your-address-url>/facebook`.

Once the verification process has been completed, Facebook will immediately start sending events to your Airy Core Platform instance.



