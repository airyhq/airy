import React from 'react';

import {Channel} from 'httpclient';

import {ReactComponent as GoogleIcon} from '../../assets/images/icons/google_avatar.svg';
import {ReactComponent as WhatsappIcon} from '../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as SmsIcon} from '../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as FacebookIcon} from '../../assets/images/icons/messenger_avatar.svg';

const sourceIconsMap = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  'twilio.sms': SmsIcon,
  'twilio.whatsapp': WhatsappIcon,
};

export const IconChannelFilter = ({channel}: {channel: Channel}) => {
  const SourceIcon = sourceIconsMap[channel.source];
  return <SourceIcon />;
};
