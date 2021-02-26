import React from 'react';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';

type TwilioWhatsAppSourceProps = {whatsappSmsSource: Channel[]};

const TwilioWhatsAppSource = (props: TwilioWhatsAppSourceProps) => {
  const channels = props.whatsappSmsSource.filter((channel: Channel) => channel.source === 'twilio.whatsapp');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="Whatsapp"
        text="World #1 chat app"
        image={<WhatsappLogo />}
        buttonIcon={<AddChannel />}
        displayButton={!channels.length}
      />

      <SourceInfo
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

export default TwilioWhatsAppSource;
