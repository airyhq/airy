import React from 'react';
import styles from './ChatPluginSource.module.scss';
import {ReactComponent as AiryLogo} from '../../../assets/images/icons/airy_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type chatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: chatPluginProps) => {
  const chatPluginSources = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(0, 4);
  const chatPluginSourcesExtra = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(4);
  const totalChatPluginSources = chatPluginSources.concat(chatPluginSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        buttonIcon={<AddChannel />}
        shouldDisplayButton={chatPluginSources.length === 0}
      />

      <ChannelsConnected
        showConnectedChannels={chatPluginSources.length > 0}
        showSumOfChannels={totalChatPluginSources.length}
        connected="CONNECTED"
        connectedChannel={chatPluginSources}
        placeholderImage={<Placeholder />}
        extraChannel={chatPluginSourcesExtra.length > 0}
        displayExtraChannel={chatPluginSourcesExtra.length}
        isConnected="connected"
        addAChannel={<AddChannel />}
        ignoreChannelId={chatPluginSources.length > 0}
      />
    </div>
  );
};

export default ChatPluginSource;
