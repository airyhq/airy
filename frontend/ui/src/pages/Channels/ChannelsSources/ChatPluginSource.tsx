import React from 'react';
import styles from './ChannelDetails.module.scss';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type chatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: chatPluginProps) => {
  const chatPluginSources = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(0, 4);
  const chatPluginSourcesExtra = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(4);
  const totalChatPluginSources = chatPluginSources.concat(chatPluginSourcesExtra);

  const connectedAttributes = {
    showConnectedChannels: chatPluginSources.length > 0,
    connectedChannel: chatPluginSources,
    showSumOfChannels: totalChatPluginSources.length,
    ignoreChannelId: chatPluginSources.length > 0,
  };

  const connectedAttributesExtra = {
    extraChannel: chatPluginSourcesExtra.length > 0,
    displayExtraChannel: chatPluginSourcesExtra.length,
  };

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        buttonIcon={<AddChannel />}
        displayButton={chatPluginSources.length === 0}
      />

      <ChannelsConnected
        {...connectedAttributes}
        {...connectedAttributesExtra}
        connected="CONNECTED"
        placeholderImage={<AiryLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default ChatPluginSource;
