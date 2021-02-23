import React from 'react';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type chatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: chatPluginProps) => {

  const channels = props.pluginSource || [];

  return (
    <div style={{display: "flex",flexGrow: 1}}>
      <ChannelDetails
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        buttonIcon={<AddChannel />}
        displayButton={channels.length <= 4}
      />

      <ChannelsConnected
        source="chat_plugin"        
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<AiryLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default ChatPluginSource;
