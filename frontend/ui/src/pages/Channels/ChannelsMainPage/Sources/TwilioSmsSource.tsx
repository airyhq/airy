import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {CHANNELS_TWILIO_SMS_ROUTE} from '../../../../routes/routes';
import {ChannelSource} from 'httpclient';
import {TwilioModal} from '../SourcesModal/TwilioModal';

type TwilioSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilioSmsSource = (props: TwilioSmsSourceProps & RouteComponentProps) => {
  const channels = props.twilloSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');

  const [modalPopUp, setmodalPopUp] = useState(false);

  const connectTwilioChannel = () => {
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
          id={ChannelSource.twilioSMS}
          onAddChannelClick={connectTwilioChannel}
          // onAddChannelClick={() => {
          //   props.history.push(CHANNELS_TWILIO_SMS_ROUTE);
          // }}
          // onAddChannelClick={connectSmsChannel}
        />

        <SourceInfo
          source="twilio.sms"
          channels={channels}
          connected="CONNECTED"
          placeholderImage={<SMSLogo />}
          isConnected="connected"
          onAddChannelClick={() => {
            props.history.push(CHANNELS_TWILIO_SMS_ROUTE);
          }}
          onChannelClick={(channel: Channel) => {
            props.history.push(CHANNELS_TWILIO_SMS_ROUTE + `/${channel.id}`);
          }}
        />
      </div>

      {modalPopUp && <TwilioModal />}
    </>
  );
};

export default withRouter(TwilioSmsSource);
