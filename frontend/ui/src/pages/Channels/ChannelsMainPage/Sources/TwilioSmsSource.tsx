import React, {useState, useEffect} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {Channel} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {CHANNELS_TWILIO_SMS_ROUTE} from '../../../../routes/routes';
import {ChannelSource} from 'httpclient';
import SmsWhatsappDialogue from '../../Twilio/SmsWhatsappDialogue';

type TwilioSmsSourceProps = {twilioSmsSource: Channel[]};

const TwilioSmsSource = (props: TwilioSmsSourceProps & RouteComponentProps) => {
  const channels = props.twilioSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');
  const [showModal, setShowModal] = useState(false);
  const closeModalOnClick = () => setShowModal(false);

  useEffect(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceDescription
          title="SMS"
          text="Deliver SMS with ease"
          image={<SMSLogo />}
          displayButton={!channels.length}
          id={ChannelSource.twilioSMS}
          onAddChannelClick={() => setShowModal(true)}
        />

        <SourceInfo
          source="twilio.sms"
          channels={channels}
          connected="CONNECTED"
          placeholderImage={<SMSLogo />}
          isConnected="connected"
          onSourceInfoClick={() => {
            props.history.push({
              pathname: CHANNELS_CONNECTED_ROUTE + `/twilio.sms/#`,
              state: {source: 'twilio.sms'},
            });
          }}
          onChannelClick={(channel: Channel) => {
            props.history.push(CHANNELS_TWILIO_SMS_ROUTE + `/${channel.id}`);
          }}
          onAddChannelClick={() => {
            props.history.push(CHANNELS_TWILIO_SMS_ROUTE + '/new_account');
          }}
        />
      </div>
      {showModal && (
        <SmsWhatsappDialogue
          close={closeModalOnClick}
          callModal={() => {
            props.history.push(CHANNELS_TWILIO_SMS_ROUTE + '/new_account');
          }}
        />
      )}
    </>
  );
};

export default withRouter(TwilioSmsSource);
