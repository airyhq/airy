---
title: Facebook Source
sidebar_label: Facebook Source
---

## Introduction

The Facebook source provides a channel of communication between your managed Facebook page and your running instance of the airy core.

Like for any other source you must connect a channel first using the [channels
connection endpoint](api/http.md#connecting-channels) and setting the `source`
field in the request payload to `facebook`. The token parameter must be the token provided by Facebook.

## Configuration

For Facebook to start sending events to your local instance, it must first verify your instance with a challenge.
The only configuration needed for that to happen is to set the environment variable `FB_WEBHOOK_SECRET` with the provided token
by Facebook.

You must also configure the webhook URL to `https://<your-address-url>/facebook`.

## Events

After the verification process, Facebook will start sending events to your local instance.

```json5
POST /facebook
```

Those events will be processed and turned into messages.




