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
import GearSVG from "@site/static/icons/gear.svg";
import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy Core comes with all the components you need for a fully-featured conversational platform.

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
    title='Connectors for all conversational sources'
    description="Connect anything from our free open-source live chat plugin, Facebook Messenger, Google's Business Messages to your Airy Core. This is all possible through an ingestion platform that heavily relies on Apache Kafka to process incoming webhook data from different sources. We make sense of the data and reshape it into source independent contacts, conversations, and messages."
    link='/sources/introduction'
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
    description="A WebSocket server that allows clients to receive near real-time updates about data flowing through the system."
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
    title='UI: From an inbox to dashboards'
    description="Not every message can be handled by code, this is why Airy comes with different UIs ready for you and your teams to use."
    link='/ui/inbox/introduction'
/>
<ButtonBox
    icon={<GearSVG />}
    iconInvertible={true}
    title='Integrations'
    description="Pre-made integrations into popular conversational tools, for example NLP tools like Rasa"
    link='/integrations/rasa-assistant'
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

More information about the components API can be found [here](/api/endpoints/components).
