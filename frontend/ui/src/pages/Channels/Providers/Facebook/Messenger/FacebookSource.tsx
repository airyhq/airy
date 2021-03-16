import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Channel, SourceType} from 'httpclient';
import ConnectedChannelsBySourceCard from '../../../ConnectedChannelsBySourceCard';
import SourceTypeDescriptionCard from '../../../SourceTypeDescriptionCard';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/messenger_avatar.svg';

import {CHANNELS_FACEBOOK_ROUTE, CHANNELS_CONNECTED_ROUTE} from '../../../../../routes/routes';

type FacebookSourceProps = {
  facebookSource: Channel[];
  addChannelAction: (source: string) => void;
};

const FacebookSource = (props: FacebookSourceProps & RouteComponentProps) => {
  const channels = props.facebookSource.filter((channel: Channel) => channel.source === 'facebook');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceTypeDescriptionCard
        title="Messenger "
        text="Connect multiple Facebook pages"
        image={<MessengerAvatarIcon />}
        displayButton={!channels.length}
        id={SourceType.facebook}
        onAddChannelClick={() => props.addChannelAction(SourceType.facebook)}
      />

      <ConnectedChannelsBySourceCard
        source="facebook"
        channels={channels}
        connected="CONNECTED"
        isConnected="connected"
        onAddChannelClick={() => props.history.push(CHANNELS_FACEBOOK_ROUTE)}
        onChannelClick={(channel: Channel) => {
          props.history.push({
            pathname: CHANNELS_FACEBOOK_ROUTE + `/${channel.id}`,
            state: {channel: channel},
          });
        }}
        onSourceInfoClick={() => {
          props.history.push({
            pathname: CHANNELS_CONNECTED_ROUTE + `/facebook`,
          });
        }}
      />
    </div>
  );
};

export default withRouter(FacebookSource);
