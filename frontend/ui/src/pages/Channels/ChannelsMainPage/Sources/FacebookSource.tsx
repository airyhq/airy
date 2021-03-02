import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {ChannelSource} from 'httpclient';
import {CHANNELS_FACEBOOK_ROUTE} from '../../../../routes/routes';
import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';

type FacebookSourceProps = {
  facebookSource: Channel[];
  showDialogAction: (source: string) => void;
};

const FacebookSource = (props: FacebookSourceProps & RouteComponentProps) => {
  const channels = props.facebookSource.filter((channel: Channel) => channel.source === 'facebook');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Messenger "
        text="Connect multiple Facebook pages"
        image={<FacebookLogo />}
        displayButton={!channels.length}
        id={ChannelSource.facebook}
        onAddChannelClick={() => props.showDialogAction(ChannelSource.facebook)}
      />

      <SourceInfo
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
        onSourceInfoClick={(source: string) => {
          props.history.push({
            pathname: CHANNELS_CONNECTED_ROUTE,
            state: {source: 'facebook'},
          });
        }}
        // onSourceInfoClick={(channel: Channel) => props.history.push(CHANNELS_CONNECTED_ROUTE)}
      />
    </div>
  );
};

export default withRouter(FacebookSource);
