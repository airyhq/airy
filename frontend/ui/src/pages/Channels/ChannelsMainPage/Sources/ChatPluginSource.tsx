import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {Channel} from 'httpclient';
import SourceInfo from '../SourceInfo';
import SourceDescription from '../SourceDescription';
import {ChannelSource} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {CHANNELS_CHAT_PLUGIN_ROUTE} from '../../../../routes/routes';
import {cyChannelsChatPluginAddButton, cyChannelsChatPluginList} from 'handles';

type ChatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: ChatPluginProps & RouteComponentProps) => {
  const channels = props.pluginSource.filter((channel: Channel) => channel.source === 'chatplugin');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        displayButton={!channels.length}
        id={ChannelSource.chatPlugin}
        dataCyAddChannelButton={cyChannelsChatPluginAddButton}
        onAddChannelClick={() => {
          props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        }}
      />

      <SourceInfo
        source="chatplugin"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<AiryLogo />}
        isConnected="connected"
        dataCyAddChannelButton={cyChannelsChatPluginAddButton}
        dataCyChannelList={cyChannelsChatPluginList}
        onSourceInfoClick={() => {
          props.history.push({
            pathname: CHANNELS_CONNECTED_ROUTE + `/chatplugin`,
            state: {source: 'chatplugin'},
          });
        }}
        onMoreChannelsClick={() => {
          props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE);
        }}
        onAddChannelClick={() => {
          props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        }}
        onChannelClick={(channel: Channel) => {
          props.history.push(`${CHANNELS_CHAT_PLUGIN_ROUTE}/${channel.id}`);
        }}
      />
    </div>
  );
};

export default withRouter(ChatPluginSource);
