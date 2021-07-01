# Airy Chat Plugin

[Airy Chat Plugin](https://airy.co/docs/core/sources/chatplugin/overview) is an open-source chat widget that is fully customizable and included in [Airy Core](https://airy.co/docs/core/). This package enables you to import the widget and use it in your React application.

## Install

```bash
npm install --save @airyhq/chat-plugin
```

or

```bash
yarn add @airyhq/chat-plugin
```

## Usage

Install the package and import the Airy Chat Plugin to your React component. Pass the configuration variables to the AiryChatPlugin wrapper to customize it.

```tsx
import React from "react";
import {AiryChatPlugin, AiryChatPluginConfiguration} from "@airyhq/chat-plugin";

const Component = () => {
  const demoConfig: AiryChatPluginConfiguration = {
    apiHost: <em>yourApiHost</em>,
    channelId: <em>yourChannelId</em>,
    config: {
      showMode: true,
      headerText: "i am a header text",
      startNewConversationTex: "start new conversation text",
      headerTextColor: "#FF0000",
      primaryColor: "#0000FF",
      accentColor: "#FFA500",
      backgroundColor: "#8510d8",
      bubbleIconUrl: "#FFFF00",
      sendMessageIcon: "https://yourcustomIcon/sent.png"
    }
  };

  return (
    <div className="demoChatPlugin">
      <AiryChatPlugin config={demoConfig} />
    </div>
  );
};
```

## License

Apache 2.0 © [Airy, Inc.](https://airy.co)
