---
title: Basic & advanced customization
sidebar_label: Basic & advanced customization
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## How to customize the Airy Chat Plugin

## Basic customization

After setting up your [first source](/sources/chatplugin/quickstart#step-1-set-up-your-first-source) you can customize your Airy Chat Plugin to your needs.

On your instance's [Airy Core UI](http://airy.core/ui/channels), click on the button displaying a cross icon next to the Airy Live Chat channel.

<img alt="Basic Customization Example" src={useBaseUrl('img/sources/chatplugin/channelListChatplugin.png')} />
<br/>
<br/>

Then click on the **edit** of your source:

<img alt="Basic Customization Example" src={useBaseUrl('img/sources/chatplugin/channelEditChatplugin.png')} />
<br/>
<br/>

Switch to the **Install & Customize** register and start customizing your Airy Chat Plugin to your needs.
<img alt="Basic Customization Example" src={useBaseUrl('img/sources/chatplugin/basicCustomizationChatpluginExample.png')} />

<br/>

If you are happy with your customization, copy it and add this code inside the tag `<head>`.

## Advanced customization

It is not possible to customize the Airy Chat Plugin if you use the Plug & Play Installation.

Installing the Airy Chat Plugin as a library allows you to customize the interface as much as you want using **["Render Props"](https://reactjs.org/docs/render-props.html)**.
The Airy Chat Plugin provides you with four Render Props. All Render Props parameters are optional. If you omit all of them, the Airy Chat Plugin will render the default styling and behavior.

Each Render Prop accepts a set of parameters that allows you to customize the interface or the behavior of the Airy Chat Plugin.

| Render Props                               | Description                                                                                                                                                                                                                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| headerBarProp: (orgImage, toogleHideChat)  | **Optional**. Top bar component of the Airy Chat Plugin. Can minimize the full plugin and display a custom image as brand icon for your organization <br/><br/> `orgImage` : image url <br/>`toggleHideChat()` : function that will close or open the Airy Chat Plugin |
| inputBarProp: (sendMessage)                | **Optional**. Input field that accepts a message and the `onSubmit` action that sends the message. <br/><br/>`sendMessage(text)` : function that sends a message to the server. It takes a string as parameter                                                         |
| airyMessageProp(message)                   | **Optional**. Welcome message to display in the conversation. <br/><br/>`message` : message.payload                                                                                                                                                                    |
| bubbleProp: (isChatHidden, toggleHidechat) | **Optional**. Area used as a toggle to open and close the chat and also a brand icon. <br/><br/>`isChatHidden` : boolean value that indicatas if the chat is closed or open. <br/>`toogleHideChat()` : function that closes or opens the Airy Chat Plugin.             |

**Example of how to use Render Props with the Airy Chat Plugin library:**

```json5
const airyChatPlugin = new AiryChatPlugin({
    organization_id: "YOUR_ORG_ID",
    app_id: "YOUR_APP_ID",
    app_secret: "YOUR_APP_SECRET",
    headerBarProp: ({orgImage, toggleHideChat}) =>
        <div className="customHeaderStyle" onClick={toggleHideChat}>
            <h1 className="customHeaderTitle">Title</h1>
            <img src={orgImage} alt="orgImg" />
        </div>
    }
);
```
