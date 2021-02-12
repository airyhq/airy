---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import ServerStackSVG from "@site/static/icons/server-stack.svg";
import WebhooksSVG from "@site/static/icons/webhooks.svg";

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

<ButtonBoxList>
<ButtonBox
    icon={() => <BoltSVG />}
    title='HTTP API'
    description='Access your conversational data with blazing fast HTTP endpoints'
    link='api/endpoints/introduction'
/>
<ButtonBox
    icon={() => <ServerStackSVG />}
    title='WebSocket Server'
    description='Power real-time applications with STOMP style WebSocket'
    link='api/websocket'
/>
<ButtonBox
    icon={() => <WebhooksSVG />}
    title='Webhook'
    description='Participate programmatically in conversations by listening to events'
    link='api/webhook'
/>
</ButtonBoxList>
