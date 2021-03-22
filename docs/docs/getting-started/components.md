---
title: Core Components
sidebar_label: Core Components
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";
import SpeechBalloonSVG from "@site/static/icons/speech-balloon.svg";
import HighVoltageSVG from "@site/static/icons/high-voltage.svg";
import ElectricPlugSVG from "@site/static/icons/electric-plug.svg";
import FishingPoleSVG from "@site/static/icons/fishing-pole.svg";
import GearSVG from "@site/static/icons/gear.svg";

The Airy Core platform contains the following core components:

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
    title='Webhook integration to connect custom apps' 
    description="A webhook integration server that allows its users to programmatically participate in conversations by sending messages (the webhook integration exposes events users can listen to and react programmatically.)"
    link='/api/webhook'
/>
<ButtonBox 
    icon={<DiamondSVG />}
    iconInvertible={true}
    title='UI: From an inbox to dashboards' 
    description="Not every message can be handled by code, this is why Airy comes with different UIs ready for you and your teams to use."
    link='/apps/ui/introduction'
/>
<ButtonBox 
    icon={<GearSVG />}
    iconInvertible={true}
    title='Integrations' 
    description="Pre-made integrations into popular conversational tools, for example NLP tools like Rasa"
    link='/integrations/rasa'
/>
</ButtonBoxList>
