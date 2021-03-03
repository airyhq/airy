import React from 'react';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';

type FacebookSourceProps = {facebookSource: Channel[]};

const FacebookSource = (props: FacebookSourceProps) => {
  const channels = props.facebookSource.filter((channel: Channel) => channel.source === 'facebook');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Messenger "
        text="Connect multiple Facebook pages"
        image={<FacebookLogo />}
        displayButton={!channels.length}
      />

      <SourceInfo source="facebook" channels={channels} connected="CONNECTED" isConnected="connected" />
    </div>
  );
};

export default FacebookSource;
