---
title: Introduction
sidebar_label: Introduction
slug: /
---

import TLDR from "@site/src/components/TLDR";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import RocketSVG from "@site/static/icons/rocket.svg";
import DiamondSVG from "@site/static/icons/diamond.svg";
import SpeechBalloonSVG from "@site/static/icons/speech-balloon.svg";
import HighVoltageSVG from "@site/static/icons/high-voltage.svg";
import ElectricPlugSVG from "@site/static/icons/electric-plug.svg";
import FishingPoleSVG from "@site/static/icons/fishing-pole.svg";
import GearSVG from "@site/static/icons/gear.svg";

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

## Get Started

<ButtonBoxList>
<ButtonBox 
    icon={() => <RocketSVG />}
    title='Start Installation' 
    description='Install Airy with our CLI, locally or in the cloud' 
    link='cli/installation'
/>
</ButtonBoxList>

Once you have Airy installed, follow our Quick Start for guidance.

<ButtonBoxList>
<ButtonBox 
    icon={() => <DiamondSVG />}
    title='To the Quick Start' 
    description='Learn the Airy Basics with our Quick Start' 
    link='getting-started/quickstart'
/>
</ButtonBoxList>

We'll guide you through the following journey:

- Connect your first Source
- Send Messages
- Use the API to list conversations
- Consume directly from Kafka

## Airy Core Components

The platform contains the following core components:

<ButtonBoxList>
<ButtonBox 
    icon={() => <SpeechBalloonSVG />}
    title='Connectors for all conversational sources' 
    description="Connect anything from our free open-source live chat plugin, Facebook Messenger, Google's Business Messages to your Airy Core. This is all possible through an ingestion platform that heavily relies on Apache Kafka to process incoming webhook data from different sources. We make sense of the data and reshape it into source independent contacts, conversations, and messages."
    link='/sources/introduction'
/>
<ButtonBox 
    icon={() => <HighVoltageSVG />}
    title='APIs to access your data' 
    description="An API to access conversational data with blazing fast HTTP endpoints."
    link='/api/endpoints/introduction'
/>
<ButtonBox 
    icon={() => <ElectricPlugSVG />}
    title='WebSockets to power real-time applications' 
    description="A WebSocket server that allows clients to receive near real-time updates about data flowing through the system."
    link='/api/websocket'
/>
<ButtonBox 
    icon={() => <FishingPoleSVG />}
    title='Webhook integration to connect custom apps' 
    description="A webhook integration server that allows its users to programmatically participate in conversations by sending messages (the webhook integration exposes events users can listen to and react programmatically.)"
    link='/api/webhook'
/>
<ButtonBox 
    icon={() => <DiamondSVG />}
    title='UI: From an inbox to dashboards' 
    description="Not every message can be handled by code, this is why Airy comes with different UIs ready for you and your teams to use."
    link='/apps/ui/introduction'
/>
<ButtonBox 
    icon={() => <GearSVG />}
    title='Integrations' 
    description="Pre-made integrations into popular conversational tools, for example NLP tools like Rasa"
    link='/integrations/rasa'
/>
</ButtonBoxList>
