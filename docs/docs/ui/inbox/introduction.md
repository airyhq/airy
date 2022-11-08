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

The Inbox features a [Messenger](messenger), filled with the conversations from all of your [connectors](connectors/sources/introduction.md). You can chat, organize your conversations with features such as [Filters, Search](messenger#search-and-filter) and [Tags](tags), view and edit [contacts](contacts), in addition to adding [suggested replies](suggestedReplies) to messages to improve response time.

To run the Inbox UI locally, you can start its development server with the command:<br/>
`./scripts/web-dev.sh //frontend/inbox:bundle_server`

<ButtonBoxList>
    <ButtonBox
        icon={<DesktopComputerSVG />}
        iconInvertible={true}
        title='Messenger'
        description='View your conversations & send and receive messages'
        link='ui/inbox/messenger'
    />
        <ButtonBox
        icon={<CommentBubbleSVG />}
        iconInvertible={true}
        title='Suggested Replies'
        description='Add suggested replies to your messages'
        link='ui/inbox/suggestedReplies'
    />
    <ButtonBox
        icon={<LabelSVG />}
        iconInvertible={true}
        title='Tags'
        description='Tag your conversations for easy filtering, searching & segmenting'
        link='ui/inbox/tags'
    />    
    <ButtonBox
        icon={<ContactsSVG />}
        iconInvertible={true}
        title='Contacts'
        description='View and edit contacts for personalized interactions'
        link='ui/inbox/contacts'
    />
</ButtonBoxList>

<br />

Screenshot of the Inbox UI:
<img alt="Inbox with a Facebook conversation highlighted" src={useBaseUrl('img/ui/templateButtonFacebook.png')} />

<img alt="Create Tags"src={useBaseUrl('img/ui/tagsCreate.png')} />
