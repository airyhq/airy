import React from 'react';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';

type GoogleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: GoogleSourceProps) => {
  const channels = props.googleSource.filter((channel: Channel) => channel.source === 'google');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Google Business Messages"
        text="Be there when people search"
        image={<GoogleLogo />}
        buttonIcon={<AddChannel />}
        displayButton={!channels.length}
      />

      <SourceInfo
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
