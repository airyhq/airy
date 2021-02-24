import React from 'react';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';

type TwilioSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilioSmsSource = (props: TwilioSmsSourceProps) => {
  const channels = props.twilloSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');

  return (
    <div style={{display: 'flex', flexGrow: 1}}>
      <SourceDescription
        title="SMS "
        text="Deliver SMS with ease"
        image={<SMSLogo />}
        buttonIcon={<AddChannel />}
        displayButton={!channels.length}
      />

      <SourceInfo
        source="twilio.sms"
        channels={channels}
        connected="CONNECTED"
        placeholderImage={<SMSLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default TwilioSmsSource;
