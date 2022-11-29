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
import SpeechBalloonSVG from "@site/static/icons/speechBalloon.svg";
import HighVoltageSVG from "@site/static/icons/highVoltage.svg";
import ElectricPlugSVG from "@site/static/icons/electricPlug.svg";
import FishingPoleSVG from "@site/static/icons/fishingPole.svg";
import GearSVG from "@site/static/icons/gear.svg";
import AiryBubbleSVG from "@site/static/icons/airyBubble.svg";

<TLDR>

Airy Core is an is an **open-source** **streaming** **app framework** to train ML models and supply them with historical and real-time data.

</TLDR>

<Image lightModePath="img/getting-started/introduction-light.png" darkModePath="img/getting-started/introduction-light.png"/>

<h3>Get Airy up and running with one command</h3>

```bash
# Install the Airy CLI
brew install airyhq/airy/cli

# Create Airy with one command
airy create --provider=aws
```

## What Airy is used for

With Airy Core you can process data from a variety of sources:

- Facebook Messenger
- WhatsApp Business API
- Google's Business Messages
- SMS
- Website Chat Plugins
- Any source you want with Custom Connectors

You can then use Airy Core to:

- Join historical and real-time data in the stream to create smarter ML and AI applications.
- Build real-time data pipelines and make real-time data universally accessible with our open-source streaming app framework.
- Standardize complex data ingestion and consume data directly from Kafka. Stream it directly to standard and customized applications, using pre-built, easily configured connectors.
- Significantly simplify deployment and reduce development times and increase the robustness of your infrastructure and apps.

Since Airy's infrastructure is built around Apache Kafka,
it can process a large amount of events simultaneously and stream the relevant real-time
and historical data to wherever you need it.

## Next steps

<ButtonBoxList>
<ButtonBox
    icon={<AiryBubbleSVG />}
    title="What are Airy's components?"
    description="Learn about Airy's app framework and components"
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
