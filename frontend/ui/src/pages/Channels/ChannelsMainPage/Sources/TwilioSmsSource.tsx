import React, {useState} from 'react';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {ChannelSource} from 'httpclient';
import TwilioSmsModal from './TwilioSmsModal';

type TwilioSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilioSmsSource = (props: TwilioSmsSourceProps) => {
  const channels = props.twilloSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');

  const [modalPopUp, setmodalPopUp] = useState(false);

  const connectSmsChannel = () => {
    setmodalPopUp(true);
  };

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceDescription
          title="SMS "
          text="Deliver SMS with ease"
          image={<SMSLogo />}
          displayButton={!channels.length}
          onAddChannelClick={connectSmsChannel}
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

      {modalPopUp && <TwilioSmsModal />}
    </>
  );
};

export default TwilioSmsSource;
