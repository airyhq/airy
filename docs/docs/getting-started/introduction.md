---
title: Welcome to Airy!
sidebar_label: Introduction
slug: /
---

import TLDR from "@site/src/components/TLDR";
import Image from "@site/src/components/Image";
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

<TLDR>

Airy Core is an **open source**, **fully-featured**, **production-ready**
conversational platform.

</TLDR>

<Image lightModePath="img/getting-started/introduction-light.png" darkModePath="img/getting-started/introduction-dark.png"/>

## What Airy is used for

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

## Next steps

<ButtonBoxList>
<ButtonBox
    icon={<AiryBubbleSVG />}
    title="What are Airy's components?"
    description="Learn about Airy's messaging platform and components"
    link='getting-started/components'
/>
<ButtonBox
    icon={<RocketSVG />}
    iconInvertible={true}
    title='Installation'
    description='Install Airy locally or in the cloud of your choice'
    link='getting-started/installation/introduction'
/>
<ButtonBox
    icon={<DiamondSVG />}
    iconInvertible={true}
    title='To the Quick Start'
    description='Learn the Airy Basics with our Quick Start'
    link='getting-started/quickstart'
/>
</ButtonBoxList>
