import React from 'react';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type googleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: googleSourceProps) => {
  const channels = props.googleSource.filter((channel: Channel) => channel.source === 'google');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <ChannelDetails
        title="Google Business Messages"
        text="Be there when people search"
        image={<GoogleLogo />}
        buttonIcon={<AddChannel />}
        displayButton={!channels.length}
      />

      <ChannelsConnected
        source="google"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<GoogleLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default GoogleSource;
