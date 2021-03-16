import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Channel, SourceType} from 'httpclient';
import ConnectedChannelsBySourceCard from '../../../ConnectedChannelsBySourceCard';
import SourceTypeDescriptionCard from '../../../SourceTypeDescriptionCard';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/sms_avatar.svg';

import {CHANNELS_CONNECTED_ROUTE, CHANNELS_TWILIO_SMS_ROUTE} from '../../../../../routes/routes';

type TwilioSmsSourceProps = {twilioSmsSource: Channel[]; addChannelAction: (source: string) => void};

const TwilioSmsSource = (props: TwilioSmsSourceProps & RouteComponentProps) => {
  const channels = props.twilioSmsSource.filter((channel: Channel) => channel.source === 'twilio.sms');

  return (
    <>
      <div style={{display: 'flex', flexGrow: 1}}>
        <SourceTypeDescriptionCard
          title="SMS"
          text="Deliver SMS with ease"
          image={<SMSAvatarIcon />}
          displayButton={!channels.length}
          id={SourceType.twilioSMS}
          onAddChannelClick={() => props.addChannelAction(SourceType.twilioSMS)}
        />

        <ConnectedChannelsBySourceCard
          source="twilio.sms"
          channels={channels}
          connected="CONNECTED"
          placeholderImage={<SMSAvatarIcon />}
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
    </>
  );
};

export default withRouter(TwilioSmsSource);
