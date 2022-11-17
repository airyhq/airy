---
title: Overview
sidebar_label: Overview
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";

Connect anything to your Airy Core - from our Open-Source [Airy Live Chat Plugin](sources/chatplugin/overview) to [Facebook Messenger](sources/facebook), [Instagram](sources/instagram), [Google's Business Messages](sources/google), [IBM Watson Assistant](conversational-ai/ibm-watson-assistant), and more.

This is all possible through an ingestion platform that heavily relies on Apache Kafka to process incoming webhook data from different sources. We make sense of the data and reshape it into source independent contacts, conversations, and messages.

<ButtonBoxList>
<ButtonBox
    iconInvertible={true}
    title='Sources'
    description="Connect to sources such as Airy Live Chat Plugin, Facebook Messenger, Instagram, Google's Business Messages, WhatsApp, and more."
    link='/connectors/sources/introduction'
/>
<ButtonBox
    iconInvertible={true}
    title='Conversational AI connectors'
    description="Level up your channels' communication with AI assistants such as Cognigy.AI, IBM Watson Assistant or Rasa."
    link='/connectors/conversational-ai/introduction'
/>
</ButtonBoxList>
