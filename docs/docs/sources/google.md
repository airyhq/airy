---
title: Google’s Business Messages
sidebar_label: Google’s Business Messages
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Start receiving and sending messages from **Google Maps & Google Search**.

</TLDR>

The Google source provides a channel of communication between your Google
Business Location and your running instance of Airy Core.

:::tip What you will learn

- The required steps to configure the Google source
- How to connect a Google Business Location to Airy Core

:::

## Configuration

The first step is to copy the Google Service Account file provided by Google to
`infrastructure/airy.yaml` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key

Once the verification process has been completed, Google will immediately start
sending events to your Airy Core instance.
