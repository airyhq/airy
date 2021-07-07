# Airy Chat Plugin

[Airy Chat Plugin](https://airy.co/docs/core/sources/chatplugin/overview) is an open-source chat widget that is fully customizable and included in [Airy Core](https://airy.co/docs/core/).

## Install

```bash
npm install --save @airyhq/chat-plugin
```

or

```bash
yarn add @airyhq/chat-plugin
```

## Usage

First, [set up the Airy Chat Plugin as a source](https://airy.co/docs/core/sources/chatplugin/quickstart) to Airy Core to get the channelId. Then, install the package and import the Airy Chat Plugin to a React component. Pass the configuration variables to the AiryChatPlugin wrapper to customize it.

```tsx
import React from "react";
import {AiryChatPlugin, AiryChatPluginConfiguration} from "@airyhq/chat-plugin";

const Component = () => {
  const config: AiryChatPluginConfiguration = {
    apiHost: ApiHostURL,
    channelId: yourChannelId,
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
      <AiryChatPlugin config={config} />
    </div>
  );
};
```

## License

Apache 2.0 © [Airy, Inc.](https://airy.co)
