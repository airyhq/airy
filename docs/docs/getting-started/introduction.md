---
title: Welcome to Airy!
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
import AiryBubbleSVG from "@site/static/icons/airy-bubble.svg";

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
    icon={() => <AiryBubbleSVG />}
    title='What is Airy?' 
    description='Learn about Airys messaging platform and components' 
    link='getting-started/components'
/>
</ButtonBoxList>

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
