---
title: WebSocket
sidebar_label: WebSocket
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy Core offers a WebSocket server that allows clients to **connect and receive
near real-time updates**.

</TLDR>

The WebSocket server uses the
[STOMP](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol)
protocol endpoint at `/ws.events`.

To execute the handshake with `/ws.events` you must set an
`Authorization` header where the value is the authorization token obtained [from
the API](/api/introduction#authentication).

## Event Payloads

All event updates are sent to the `/events` queue as JSON encoded payloads. The `type`
field informs the client of the kind of update that is encoded in the payload.

import EventPayloads from "./event-payloads.mdx"

<EventPayloads />
