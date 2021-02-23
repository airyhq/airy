import React from 'react';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type facebookSourceProps = {facebookSource: Channel[]};

const FacebookSource = (props: facebookSourceProps) => {

  const channels = props.facebookSource || [];

  return (
    <div style={{display: "flex",flexGrow: 1}}>
      <ChannelDetails
        title="Messenger "
        text="Connect multiple Facebook pages"
        image={<FacebookLogo />}
        buttonIcon={<AddChannel />}
        displayButton={channels.length <= 4}
      />

      <ChannelsConnected
        source="facebook"        
        channels={channels}
        connected="CONNECTED"
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default FacebookSource;
