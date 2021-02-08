---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Interact with your Airy Core via **HTTP Endpoints**, **WebSockets** or
**Webhooks**.

</TLDR>

This documents offers a high-level overview of the different parts that compose
the Airy Core API.

Once you connect Airy Core to a [source](/getting-started/glossary.md#source),
the platform will immediately start consuming conversational data and store it
in its streaming data platform. Airy Core exposes three different ways of
interacting with data:

- an [HTTP API](/api/endpoints/introduction.md)
- A [WebSocket server](/api/websocket.md)
- A [Webhook integration](/api/webhook.md)
