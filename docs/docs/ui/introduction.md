---
title: Introduction
sidebar_label: Introduction
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import GearSVG from "@site/static/icons/gear.svg";
import DesktopComputerSVG from "@site/static/icons/desktopComputer.svg";
import LabelSVG from "@site/static/icons/label.svg";
import CommentBubbleSVG from "@site/static/icons/commentBubble.svg";
import ChannelsUI from "@site/static/icons/channelsUi.svg";
import ContactsSVG from "@site/static/icons/contacts.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

Not every message can be handled by code, which is why Airy comes with different UIs ready for you and your team to use.

While the [Chat Plugin](sources/chatplugin/overview.md) is the open-source chat UI for your website and app visitors, Airy UI offers all of the UI interfaces you need internally for a messaging platform.

Airy UI comes with an open-source, customizable [inbox](inbox), filled with the conversations from all of your [sources](sources/introduction.md). You can organize your conversations with features such as [Filters, Search](inbox) and [Tags](tags), view and edit [contacts](contacts), in addition to adding [suggested replies](suggestedReplies) to messages to improve response time.

<ButtonBoxList>
    <ButtonBox
        icon={<DesktopComputerSVG />}
        iconInvertible={true}
        title='Inbox'
        description='One inbox to see all your conversations & respond to them'
        link='ui/inbox'
    />
    <ButtonBox
        icon={<ChannelsUI />}
        title='Channels'
        iconInvertible={true}
        description="Connect channels' sources easily in the UI"
        link='ui/channels'
    />
    <ButtonBox
        icon={<LabelSVG />}
        iconInvertible={true}
        title='Tags'
        description='Tag your conversations for easy filtering, searching & segmenting'
        link='ui/tags'
    />   
        <ButtonBox
        icon={<ContactsSVG />}
        iconInvertible={true}
        title='Contacts'
        description='View and edit contacts for personalized interactions'
        link='ui/contacts'
    /> 
    <ButtonBox
        icon={<CommentBubbleSVG />}
        iconInvertible={true}
        title='Suggested Replies'
        description='Add suggested replies to your messages'
        link='ui/suggestedReplies'
    />
</ButtonBoxList>

Get a glimpse of the Airy UI with screenshots of the Inbox, Tags, Contacts, and suggested replies:

<img alt="Demo Inbox" src={useBaseUrl('img/ui/FacebookButtonTemplate.png')} />

<img alt="Demo Tags"src={useBaseUrl('img/ui/tags-ui.png')} />

<img alt="Demo suggested replies"src={useBaseUrl('img/ui/suggested-replies.png')} />

<img alt="Demo Contacts"src={useBaseUrl('img/ui/contactsEdit.png')} />
