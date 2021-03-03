import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {Channel} from 'httpclient';
import SourceInfo from '../SourceInfo';
import SourceDescription from '../SourceDescription';
import {ChannelSource} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {CHANNELS_CHAT_PLUGIN_ROUTE} from '../../../../routes/routes';

type ChatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: ChatPluginProps & RouteComponentProps) => {
  const channels = props.pluginSource.filter((channel: Channel) => channel.source === 'chat_plugin');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryLogo />}
        displayButton={!channels.length}
        id={ChannelSource.chatPlugin}
        onAddChannelClick={() => {
          props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        }}
      />

      <SourceInfo
        source="chat_plugin"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<AiryLogo />}
        isConnected="connected"
        onSourceInfoClick={() => {
          props.history.push({
            pathname: CHANNELS_CONNECTED_ROUTE + `/chat_plugin`,
            state: {source: 'chat_plugin'},
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
