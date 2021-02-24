import React from 'react';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {Channel} from 'httpclient';
import SourceInfo from '../SourceInfo';
import SourceDescription from '../SourceDescription';
import {ChannelSource} from 'httpclient';

type ChatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: ChatPluginProps) => {
  const channels = props.pluginSource.filter((channel: Channel) => channel.source === 'chat_plugin');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        displayButton={!channels.length}
        id={ChannelSource.chatPlugin}
      />

      <SourceInfo
        source="chat_plugin"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<AiryLogo />}
        isConnected="connected"
      />
    </div>
  );
};

export default ChatPluginSource;
