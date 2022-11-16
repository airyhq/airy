---
title: Live Chat overview
sidebar_label: Overview
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import HammerAndWrenchSVG from "@site/static/icons/hammerAndWrench.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

<TLDR>

Airy's Live Chat Plugin is an open-source chat widget that is fully customizable
and included in Airy Core.

 </TLDR>

## Introduction

Having a Live Chat plugin on your website has become essential. Connect with
your website visitors, communicate with them in real time, or use a bot to
automate FAQs.

Airy’s Live Chat Plugin comes out of the box fully functioning, and thanks to its
open-source nature and React Render Props, you can customize everything about it.

Out of the box Airy’s Live Chat Plugin supports:

- Full customization of look, feel and features
- All message types, including emojis
- Rich Messaging with templates, cards and carousels

## How it's built

The Airy Live Chat Plugin is a JavaScript library built with
[Preact](https://preactjs.com/) and
[TypeScript](https://www.typescriptlang.org/).

The library makes heavy use of [render
props](https://reactjs.org/docs/render-props.html) so that you can customize its
behavior in every aspect. The library makes all of the
[communication](/api/endpoints/chatplugin.md) with Airy Core transparent for
you.

## Customization

Completely customize your Live Chat and make it match your brand:

<ButtonBoxList>
<ButtonBox
    icon={<HammerAndWrenchSVG />}
    title='Learn more about the customization of your Chat Plugin'
    description='From colors to shapes and sizes: everything is editable'
    link='/connectors/sources/chatplugin/customization'
/>
</ButtonBoxList>

## Supported message types

Airy’s Live Chat Plugin supports the following message types:

- Text Messages
- Emojis
- Rich Cards
- Rich Card Carousels
- Suggested Replies

**Samples**

| RichCard                                                                                 | RichCardCarousel                                                                                          | Emojis                                                                  |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| <img alt="Rich Card Example" src={useBaseUrl('img/ui/richCardChatpluginExample.gif')} /> | <img alt="Rich Card Carousel Example" src={useBaseUrl('img/ui/richCardCarouselChatpluginExample.gif')} /> | <img alt="Emoji Example" src={useBaseUrl('img/ui/emojiExample.png')} /> |
