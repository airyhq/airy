---
title: Inbox
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

Airy UI comes with an open-source, customizable [Inbox](inbox), filled with the conversations from all of your [sources](sources/introduction.md). You can organize your conversations with features such as [Filters, Search](inbox) and [Tags](tags), view and edit [contacts](contacts), in addition to adding [suggested replies](suggestedReplies) to messages to improve response time.

<ButtonBoxList>
    <ButtonBox
        icon={<DesktopComputerSVG />}
        iconInvertible={true}
        title='Messenger'
        description='See all your conversations and chat with your contacts'
        link='ui/inbox/messenger'
    />
    <ButtonBox
        icon={<LabelSVG />}
        iconInvertible={true}
        title='Tags'
        description='Tag your conversations for easy filtering, searching & segmenting'
        link='ui/inbox/tags'
    />    
    <ButtonBox
        icon={<CommentBubbleSVG />}
        iconInvertible={true}
        title='Suggested Replies'
        description='Add suggested replies to your messages'
        link='ui/inbox/suggestedReplies'
    />
    <ButtonBox
        icon={<ContactsSVG />}
        iconInvertible={true}
        title='Contacts'
        description='View and edit contacts for personalized interactions'
        link='ui/inbox/contacts'
    />
</ButtonBoxList>
