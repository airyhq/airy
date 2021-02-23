import React from 'react';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type whatsappSourceProps = {whatsappSmsSource: Channel[]};

const WhatsappSmsSource = (props: whatsappSourceProps) => {
  const channels = props.whatsappSmsSource.filter((channel: Channel) => channel.source === 'twilio.whatsapp');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <ChannelDetails
        title="Whatsapp"
        text="World #1 chat app"
        image={<WhatsappLogo />}
        buttonIcon={<AddChannel />}
        displayButton={!channels.length}
      />

      <ChannelsConnected
        source="twilio.whatsapp"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<WhatsappLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default WhatsappSmsSource;
