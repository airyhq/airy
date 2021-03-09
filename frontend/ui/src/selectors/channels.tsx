import React from 'react';
import {StateModel} from '../reducers';
import {pickBy} from 'lodash-es';
import {Channel, ChannelSource} from 'httpclient';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';

// Filter out channels that only have metadata
// I.e. Websocket channels don't necessarily have a name so we wait for the metadata
export const allChannels = (state: StateModel) =>
  pickBy(state.data.channels, ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1);

export const getSourceLogo = (channel: Channel) => {
  switch (channel.source) {
    case ChannelSource.facebook:
      return <FacebookLogo />;
    case ChannelSource.google:
      return <GoogleLogo />;
    case ChannelSource.twilioSMS:
      return <SMSLogo />;
    case ChannelSource.twilioWhatsapp:
      return <WhatsappLogo />;
    case ChannelSource.chatPlugin:
      return <AiryLogo />;
    default:
      return <AiryLogo />;
  }
};
