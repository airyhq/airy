---
title: Introduction
sidebar_label: Introduction
slug: /
---

import TLDR from "@site/src/components/TLDR";

## What is Airy Core?

<TLDR>

Airy Core is an **open source**, **fully-featured**, **production-ready**
messaging platform.

</TLDR>

With Airy Core you can process conversational data from a variety of sources:

- Facebook Messenger
- WhatsApp Business API
- Google's Business Messages
- SMS
- Website Chat Plugins
- Your own conversational channels

You can then use Airy Core to:

- Unify your messaging channels
- Stream your conversational data wherever you want
- Integrate with different NLP frameworks
- Mediate open requests with Agents via our messaging UI
- Analyze your conversations

Since Airy's infrastructure is built around Apache Kafka, it can process a large
amount of conversations and messages simultaneously and stream the relevant
conversational data to wherever you need it.

## Airy Core Components

The platform contains the following core components:

- An ingestion platform that heavily relies on Apache Kafka to process incoming
  webhook data from different sources. We make sense of the data and reshape it
  into source independent contacts, conversations, and messages (see our
  glossary for formal definitions).

- An HTTP API that allows you to manage the data sets the platform handles.

- A webhook integration server that allows you to programmatically participate
  in conversations by sending messages. The webhook integration exposes events
  you can "listen" to and react programmatically.

- A WebSocket server that allows you to receive near real-time updates about the
  data flowing through the system.
