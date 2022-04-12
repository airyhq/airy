---
title: Overview
sidebar_label: Overview
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import ChatSVG from "@site/static/icons/chat.svg";
import ToggleSwitchSVG from "@site/static/icons/toggleSwitch.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>
Not every message can be handled by code, which is why Airy comes with different UIs ready for you and your team to use.
</TLDR>

While the [Chat Plugin](sources/chatplugin/overview.md) is the open-source chat UI for your website and app visitors, Airy UI offers all of the UI interfaces you need internally for a messaging platform.

Airy UI comes with two open-source, customizable separate UIs: the [Inbox](inbox/introduction) and the [Control Center](control-center/introduction).

In the [Inbox](inbox/introduction), you can view, interact, and organize all your conversations with instant messaging, search, filtering, and tags.

The [Control Center](control-center/introduction) provides a technical overview of an instance's [components](control-center/components) and enables you to manage [connectors](control-center/connectors) easily.

<ButtonBoxList>
    <ButtonBox
        icon={<ChatSVG />}
        iconInvertible={true}
        title='Inbox'
        description='One inbox to view, interact, and organize all your conversations'
        link='ui/inbox/introduction'
    />
    <ButtonBox
        icon={<ToggleSwitchSVG />}
        title='Control Center'
        iconInvertible={true}
        description="Get a technical overview of your app and manage connectors easily"
        link='ui/control-center/introduction'
    />
</ButtonBoxList>

Get a glimpse of the Airy UI with screenshots of the Inbox and the Control Center:

<img alt="Inbox"src={useBaseUrl('img/ui/inbox.png')} />

<img alt="Control Center"src={useBaseUrl('img/ui/controlCenter.png')} />
