---
title: Introduction
sidebar_label: Introduction
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import CogSVG from "@site/static/icons/cog.svg";
import InboxSVG from "@site/static/icons/prototype.svg";
import TagsSVG from "@site/static/icons/price-tag.svg";
import UsersSVG from "@site/static/icons/users.svg";
import ComponentsSVG from "@site/static/icons/information-architecture.svg";

Not every message can be handled by code, this is why Airy comes with different UIs ready for you and your teams to use.

While the [Chat Plugin](sources/chat-plugin.md) is the open-source chat UI for your website and app visitors, Airy UI has different all the UI interfaces you need internally for a messaging platform.

Airy UI comes with an open-source, customizable [inbox](inbox), filled with the conversations of all your [sources](sources/introduction.md),
Additional features like [Filters, Search](inbox) and [Tags](tags) help you.

<ButtonBoxList>
    <ButtonBox
        icon={() => <CogSVG />}
        title='UI Quick Start'
        description='Step by Step Guide on getting up and running with the UI'
        link='apps/ui/ui-quick-start'
    />
    <ButtonBox
        icon={() => <InboxSVG />}
        title='Inbox'
        description='One inbox to see all your conversations & respond to them'
        link='apps/ui/inbox'
    />
    <ButtonBox
        icon={() => <TagsSVG />}
        title='Tags'
        description='Tag your conversations for easy filtering, searching & segmenting'
        link='apps/ui/tags'
    />    
    <ButtonBox
        icon={() => <ComponentsSVG />}
        title='UI Components'
        description='Buttons, Inputs, Loaders and all Airy UI Components '
        link='apps/ui/components'
    />
</ButtonBoxList>

**Overview**

<img alt="Demo Tags"
src={useBaseUrl('img/apps/ui/demotags.gif')} />
