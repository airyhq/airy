---
id: index
title: Home
slug: /
---

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows you to process messaging data from a variety of sources (like
Facebook messenger or Google business messages). The core platform contains the
following components:

- An ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](getting-started/glossary.md) for formal definitions).

- An [HTTP API](api/http/introduction.md) that allows you to manage the data sets the
  platform handles.

- A [webhook](api/webhook) integration server that allows to programmatically
  participate in conversations by sending messages. The webhook integration
  exposes events you can "listen" to and react programmatically.

- A [WebSocket](api/websocket) server that allows you to receive near real-time
  updates about the data flowing through the system.
