---
title: Introduction
sidebar_label: Introduction
---

import RobotSVG from "@site/static/icons/robot.svg";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";

Level up your channels' communication with Airy Core's conversational AI [connectors](/concepts/architecture#components).

Airy Core features conversational AI [connectors](/concepts/architecture#components) that you can easily install and configure on your instance.

<ButtonBoxList>
    <ButtonBox
        icon={<RobotSVG  />}
        iconInvertible={true}
        title='Cognigy AI'
        description='Conversational AI in a user-friendly interface'
        link='connectors/conversational-ai/cognigy-ai'
    />
    <ButtonBox
        icon={<RobotSVG  />}
        title='IBM Watson Assistant'
        iconInvertible={true}
        description="An AI assistant that builds natural conversation flows"
        link='connectors/conversational-ai/ibm-watson-assistant'
    />
       <ButtonBox
        icon={<RobotSVG  />}
        title='Rasa Open Source'
        iconInvertible={true}
        description="The most popular open source framework for building AI assistants"
        link='connectors/conversational-ai/rasa'
    />
</ButtonBoxList>
