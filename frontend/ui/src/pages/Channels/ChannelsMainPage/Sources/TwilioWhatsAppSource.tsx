import React, {useState, useEffect} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {ChannelSource} from 'httpclient';
import {CHANNELS_TWILIO_WHATSAPP_ROUTE} from '../../../../routes/routes';
import SmsWhatsappDialogue from '../SourcesRequirement/SmsWhatsappDialogue';

type TwilioWhatsAppSourceProps = {whatsappSmsSource: Channel[]};

const TwilioWhatsAppSource = (props: TwilioWhatsAppSourceProps & RouteComponentProps) => {
  const channels = props.whatsappSmsSource.filter((channel: Channel) => channel.source === 'twilio.whatsapp');
  const [showModal, setShowModal] = useState(false);
  const closeModalOnClick = () => setShowModal(false);

  useEffect(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceDescription
          title="Whatsapp"
          text="World #1 chat app"
          image={<WhatsappLogo />}
          displayButton={!channels.length}
          id={ChannelSource.twilioSMS}
          onAddChannelClick={() => setShowModal(true)}
        />

        <SourceInfo
          source="twilio.whatsapp"
          channels={channels}
          connected="CONNECTED"
          placeholderImage={<WhatsappLogo />}
          isConnected="connected"
          onAddChannelClick={() => {
            props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account');
          }}
          onChannelClick={(channel: Channel) => {
            props.history.push({
              pathname: CHANNELS_TWILIO_WHATSAPP_ROUTE + `/${channel.id}`, //Leads to edit page(/connected_twilio_sms route)
            });
          }}
        />
      </div>
      {showModal && (
        <SmsWhatsappDialogue
          close={closeModalOnClick}
          callModal={() => {
            props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE);
          }}
        />
      )}
    </>
  );
};

export default withRouter(TwilioWhatsAppSource);
