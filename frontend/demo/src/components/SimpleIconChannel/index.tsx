import React, {useState} from 'react';

import {Channel} from 'httpclient';

import {ReactComponent as GoogleIcon} from '../../assets/images/icons/google_avatar.svg';
import {ReactComponent as WhatsappIcon} from '../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as SmsIcon} from '../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as FacebookIcon} from '../../assets/images/icons/messenger_avatar.svg';

import styles from './index.module.scss';

const getInitials = (channelName: string) => {
  const tokens = channelName.split(' ');
  if (tokens.length > 1) {
    return `${tokens[0].slice(0, 1)}${tokens[1].slice(0, 1)}`;
  }
  return channelName.slice(0, 2);
};

const sourceIconsMap = {GOOGLE: GoogleIcon, FACEBOOK: FacebookIcon, SMS_TWILIO: SmsIcon, WHATSAPP_TWILIO: WhatsappIcon};

export const IconChannelFilter = ({channel}: {channel: Channel}) => {
  const SourceIcon = sourceIconsMap[channel.source];
  return <SourceIcon />;
};

export const SimpleIconChannel = ({channel}: {channel: Channel}) => {
  const imageUrl = channel.imageUrl || '';
  const [useDefault, setUseDefault] = useState(false);
  return useDefault ? (
    <span className={styles.defaultChannelIcon}>{getInitials(channel.name).toUpperCase()}</span>
  ) : (
    <img
      alt={channel.name}
      src={imageUrl}
      onError={() => {
        setUseDefault(true);
      }}
      className={styles.channelLogo}
    />
  );
};
