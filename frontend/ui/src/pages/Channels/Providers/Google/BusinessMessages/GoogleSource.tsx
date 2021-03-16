import React from 'react';

import {Channel, SourceType} from 'httpclient';
import ConnectedChannelsBySourceCard from '../../../ConnectedChannelsBySourceCard';
import SourceTypeDescriptionCard from '../../../SourceTypeDescriptionCard';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/google_avatar.svg';

type GoogleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: GoogleSourceProps) => {
  const channels = props.googleSource.filter((channel: Channel) => channel.source === 'google');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceTypeDescriptionCard
        title="Google Business Messages"
        text="Be there when people search"
        image={<GoogleAvatarIcon />}
        displayButton={!channels.length}
        id={SourceType.google}
      />

      <ConnectedChannelsBySourceCard
        source="google"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<GoogleAvatarIcon />}
        isConnected="connected"
      />
    </div>
  );
};

export default GoogleSource;
