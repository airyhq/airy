import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {CHANNELS_TWILIO_SMS_ROUTE} from '../../../../routes/routes';
import {ChannelSource} from 'httpclient';
//import TwilioModal from '../SourcesRequirement/TwilioRequirement';
import Modal from '../SourcesRequirement/Modal';

type TwilioSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilioSmsSource = (props: TwilioSmsSourceProps & RouteComponentProps) => {
  const channels = props.twilloSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');

  const [showModal, setShowModal] = useState(false);

  const closeModalHandler = () => setShowModal(false);

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceDescription
          title="SMS "
          text="Deliver SMS with ease"
          image={<SMSLogo />}
          displayButton={!channels.length}
          id={ChannelSource.twilioSMS}
          // onAddChannelClick={() => {
          //   props.history.push(CHANNELS_TWILIO_SMS_ROUTE);
          // }}
          onAddChannelClick={() => setShowModal(true)}
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
      {showModal && <Modal show={showModal} close={closeModalHandler} />}
    </>
  );
};

export default withRouter(TwilioSmsSource);
