---
title: Components
sidebar_label: Components
---

import Image from "@site/src/components/Image";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";
import SpeechBalloonSVG from "@site/static/icons/speechBalloon.svg";
import HighVoltageSVG from "@site/static/icons/highVoltage.svg";
import ElectricPlugSVG from "@site/static/icons/electricPlug.svg";
import FishingPoleSVG from "@site/static/icons/fishingPole.svg";
import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy Core comes with all the components you need to stream historical and real-time data.

</TLDR>

<Image lightModePath="img/getting-started/components-light.png" darkModePath="img/getting-started/components-dark.png"/>

## Definition

import ComponentDefinition from '../getting-started/componentDefinition.mdx'

<ComponentDefinition/>

## Component types

Airy Core contains the following components:

<ButtonBoxList>
<ButtonBox
    icon={<SpeechBalloonSVG />}
    iconInvertible={true}
    title='Connectors'
    description="By ingesting all real-time events and continuously processing, aggregating and joining them in the stream, development time can be significantly reduced. Through integrations with pre-built and easily configured connectors, events are consumed from any source, including business systems such as ERP/CRM, conversational sources, third party APIs. Airy also comes with an SDK to build custom connectors to any source."
    link='/connectors/sources/introduction'
/>
<ButtonBox
    icon={<HighVoltageSVG />}
    iconInvertible={true}
    title='APIs to access your data'
    description="An API to access conversational data with blazing fast HTTP endpoints."
    link='/api/endpoints/introduction'
/>
<ButtonBox
    icon={<ElectricPlugSVG />}
    iconInvertible={true}
    title='WebSockets to power real-time applications'
    description="A WebSocket server that allows clients to receive near real-time updates about data flowing through the system. Particularly useful in combination with our LLM connectors and apps, that can send real-time data to enrich the interaction your customers."
    link='/api/websocket'
/>
<ButtonBox
    icon={<FishingPoleSVG />}
    iconInvertible={true}
    title='Outbound webhook integration to connect custom apps'
    description="A destination webhook integration server that allows its users to programmatically participate in conversations by sending messages (the webhook integration exposes events users can listen to and react programmatically.)"
    link='/api/webhook'
/>
<ButtonBox
    icon={<DiamondSVG />}
    iconInvertible={true}
    title='UI: From a control center to dashboards'
    description="No-code interfaces to manage and control Airy, your connectors, your LLM integrations  and your streams. "
    link='/ui/inbox/introduction'
/>
</ButtonBoxList>

## Installation

For installation purposes Airy Core is packaged in a Helm chart which creates all the necessary Kubernetes resources. However, every component is an independent entity and can be installed or uninstalled separately. Every component is packaged in its own independent Helm chart and belongs to a `repository`. By default, the `airy-core` repository is added with the components that can be found under https://helm.airy.co.

You can see all the available components either from the `Catalog` in the `Control center`. From the `Control center` you can also install, uninstall, configure, enable or disable the components.

The following components are part of `Airy Core` and they cannot be uninstalled:

- airy-controller
- api-admin
- communication
- api-websocket
- frontend-inbox
- frontend-control-center

Here is a list of the open source components which can be added to `Airy Core`:

- api-contacts
- integration-source-api
- integration-webhook
- media-resolver
- sources-chatplugin
- sources-facebook
- sources-google
- sources-twilio
- sources-viber
- sources-whatsapp
- flink-connector

More information about the components API can be found [here](/api/endpoints/components).
