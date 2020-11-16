---
title: Google Source
sidebar_label: Google Source
---

## Introduction

The Google source provides a channel of communication between your Google Business Location and your running instance of the Airy Core Platform.

Like for any other source you must connect a channel first using the [channels
connection endpoint](api/http.md#connecting-channels) and setting the `source`
field in the request payload to `google`. The token parameter must be the token provided by Facebook.

## Configuration

First step is to copy the Google Service Account file provided by Google to `infrastructure/airy.conf` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified against your partner key.
You must also set the environment variable `GOOGLE_PARTNER_KEY` to your partner key

Once the verification process has been completed, Google will immediately start sending events to your Airy Core Platform instance.
