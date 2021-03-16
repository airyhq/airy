import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Channel, SourceType} from 'httpclient';
import ConnectedChannelsBySourceCard from '../../../ConnectedChannelsBySourceCard';
import SourceTypeDescriptionCard from '../../../SourceTypeDescriptionCard';
import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airy_avatar.svg';

import {CHANNELS_CONNECTED_ROUTE, CHANNELS_CHAT_PLUGIN_ROUTE} from '../../../../../routes/routes';

type ChatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: ChatPluginProps & RouteComponentProps) => {
  const channels = props.pluginSource.filter((channel: Channel) => channel.source === 'chatplugin');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceTypeDescriptionCard
        title="Airy Live Chat "
        text="Best of class browser messenger"
        image={<AiryAvatarIcon />}
        displayButton={!channels.length}
        id={SourceType.chatPlugin}
        onAddChannelClick={() => {
          props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        }}
      />

      <ConnectedChannelsBySourceCard
        source="chatplugin"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<AiryAvatarIcon />}
        isConnected="connected"
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
