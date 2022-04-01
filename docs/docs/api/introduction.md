---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import HighVoltageSVG from "@site/static/icons/highVoltage.svg";
import ElectricPlugSVG from "@site/static/icons/electricPlug.svg";
import PackageSVG from "@site/static/icons/package.svg";
import FishingPoleSVG from "@site/static/icons/fishingPole.svg";
import HammerAndWrenchSVG from "@site/static/icons/hammerAndWrench.svg";

<TLDR>

Interact with your Airy Core via **HTTP Endpoints**, **WebSockets** or
**Webhooks**.

</TLDR>

This document offers a high-level overview of the different parts that compose
the Airy Core API.

:::warning

Authentication is disabled by default in `Airy Core`.

As this is suitable **only for testing purposes**, we advise you to refer to our [documentation on how to secure the API](/getting-started/installation/security).

:::

Once you connect Airy Core to a [source](/getting-started/glossary.md#source),
the platform will immediately start consuming conversational data and store it
in its streaming data platform. Airy Core exposes three different ways of
interacting with data:

<ButtonBoxList>
<ButtonBox
    icon={<HighVoltageSVG />}
    iconInvertible={true}
    title='HTTP API'
    description='Access your conversational data with blazing fast HTTP endpoints'
    link='api/endpoints/introduction'
/>
<ButtonBox
    icon={<PackageSVG />}
    iconInvertible={true}
    title='HTTP Client'
    description='Make requests easily with the HTTP client package'
    link='api/httpClient'
/>
<ButtonBox
    icon={<ElectricPlugSVG />}
    iconInvertible={true}
    title='WebSocket Server'
    description='Power real-time applications with STOMP style WebSocket'
    link='api/websocket'
/>
<ButtonBox
    icon={<FishingPoleSVG />}
    iconInvertible={true}
    title='Webhook'
    description='Participate programmatically in conversations by listening to events'
    link='api/webhook'
/>
<ButtonBox
    icon={<HammerAndWrenchSVG />}
    iconInvertible={true}
    title='Sources'
    description='Build your own messaging sources using simple ingestion and action http calls'
    link='api/source'
/>
</ButtonBoxList>
