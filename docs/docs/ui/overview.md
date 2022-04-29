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

While the [Chat Plugin](sources/chatplugin/overview.md) is the open-source chat UI for your website and app visitors, Airy UI offers all of the interfaces you need internally for a messaging platform.

Airy UI comes with two open-source, customizable separate UIs: the [Inbox](inbox/introduction) and the [Control Center](control-center/introduction). Both can be accessed through a common landing page (see screenshot below).

The [Inbox](inbox/introduction) offers [instant messaging](inbox/messenger) along with [search, filtering](inbox/messenger#search-and-filter) and [tags](inbox/tags) to organize your conversations.

The [Control Center](control-center/introduction) provides a technical dashboard to manage your Airy Core app.

<ButtonBoxList>
    <ButtonBox
        icon={<ChatSVG />}
        iconInvertible={true}
        title='Inbox'
        description='One inbox to view, interact with, and organize all your conversations'
        link='ui/inbox/introduction'
    />
    <ButtonBox
        icon={<ToggleSwitchSVG />}
        title='Control Center'
        iconInvertible={true}
        description="A technical dashboard to manage your Airy Core app"
        link='ui/control-center/introduction'
    />
</ButtonBoxList>

Screenshot of the Airy UI landing page:
<img alt="UI Demo" src={useBaseUrl('img/ui/ui.png')} />

<br />
<br />
<br />

Screenshot of the [Inbox](inbox/introduction):
<img alt="Inbox Messenger Demo" src={useBaseUrl('img/ui/inboxMessenger.png')} />

<br />
<br />
<br />

Screenshot of the [Control Center](control-center/introduction):
<img alt="Control Center Demo"src={useBaseUrl('img/ui/controlCenterStatus.png')} />
