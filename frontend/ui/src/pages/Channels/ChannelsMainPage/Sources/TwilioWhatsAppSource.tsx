import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {Channel} from 'httpclient';
import SourceDescription from '../SourceDescription';
import SourceInfo from '../SourceInfo';
import {ChannelSource} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE, CHANNELS_TWILIO_WHATSAPP_ROUTE} from '../../../../routes/routes';

type TwilioWhatsAppSourceProps = {whatsappSmsSource: Channel[]; showDialogAction: (source: string) => void};

const TwilioWhatsAppSource = (props: TwilioWhatsAppSourceProps & RouteComponentProps) => {
  const channels = props.whatsappSmsSource.filter((channel: Channel) => channel.source === 'twilio.whatsapp');

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceDescription
          title="Whatsapp"
          text="World #1 chat app"
          image={<WhatsappLogo />}
          displayButton={!channels.length}
          id={ChannelSource.twilioWhatsapp}
          onAddChannelClick={() => props.showDialogAction(ChannelSource.twilioWhatsapp)}
        />

        <SourceInfo
          source="twilio.whatsapp"
          channels={channels}
          connected="CONNECTED"
          placeholderImage={<WhatsappLogo />}
          isConnected="connected"
          onSourceInfoClick={() => {
            props.history.push({
              pathname: CHANNELS_CONNECTED_ROUTE + `/twilio.whatsapp/#`,
              state: {source: 'twilio.whatsapp'},
            });
          }}
          onChannelClick={(channel: Channel) => {
            props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE + `/${channel.id}`);
          }}
          onAddChannelClick={() => {
            props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account');
          }}
        />
      </div>
    </>
  );
};

export default withRouter(TwilioWhatsAppSource);
