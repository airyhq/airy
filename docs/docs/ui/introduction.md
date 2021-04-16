---
title: Introduction
sidebar_label: Introduction
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import GearSVG from "@site/static/icons/gear.svg";
import DesktopComputerSVG from "@site/static/icons/desktop-computer.svg";
import LabelSVG from "@site/static/icons/label.svg";
import UsersSVG from "@site/static/icons/users.svg";
import CommentBubbleSVG from "@site/static/icons/comment-bubble.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

Not every message can be handled by code, this is why Airy comes with different UIs ready for you and your teams to use.

While the [Chat Plugin](sources/chatplugin/overview.md) is the open-source chat UI for your website and app visitors, Airy UI has different all the UI interfaces you need internally for a messaging platform.

Airy UI comes with an open-source, customizable [inbox](inbox), filled with the conversations of all your [sources](sources/introduction.md). Organize your conversations with features such as [Filters, Search](inbox), [Tags](tags) and add [suggested replies](suggestedReplies) to messages to improve response time.

<ButtonBoxList>
    <ButtonBox
        icon={<DesktopComputerSVG />}
        iconInvertible={true}
        title='Inbox'
        description='One inbox to see all your conversations & respond to them'
        link='ui/inbox'
    />
    <ButtonBox
        icon={<LabelSVG />}
        iconInvertible={true}
        title='Tags'
        description='Tag your conversations for easy filtering, searching & segmenting'
        link='ui/tags'
    />    
    <ButtonBox
        icon={<CommentBubbleSVG />}
        iconInvertible={true}
        title='Suggested Replies'
        description='Add suggested replies to your messages'
        link='ui/suggestedReplies'
    />
</ButtonBoxList>

Get a glimpse of the Airy UI with screenshots of the Inbox, Tags, and suggested replies:

<img alt="Button Template Example" src={useBaseUrl('img/ui/FacebookButtonTemplate.png')} />

<img alt="Demo Tags"src={useBaseUrl('img/ui/tags-ui.png')} />

<img alt="Demo Tags"src={useBaseUrl('img/ui/suggested-replies.png')} />
