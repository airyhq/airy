/* eslint-disable react/display-name */
import React from 'react';
import {Channel} from 'httpclient';

import {ReactComponent as FacebookIcon} from 'assets/images/icons/facebook_rounded.svg';
import {ReactComponent as GoogleIcon} from 'assets/images/icons/google-messages.svg';
import {ReactComponent as SmsIcon} from 'assets/images/icons/sms-icon.svg';
import {ReactComponent as WhatsappIcon} from 'assets/images/icons/whatsapp-icon.svg';
import {ReactComponent as MessengerAvatar} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as AiryIcon} from 'assets/images/icons/airy-icon.svg';

import styles from './index.module.scss';

type IconChannelProps = {
  channel: Channel;
  icon?: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  text?: boolean;
};

const PlaceholderChannelData: Channel = {
  id: 'id',
  source: 'facebook',
  metadata: {
    name: 'Retrieving Data...',
  },
  sourceChannelId: 'external_channel_id',
  connected: true,
};

const SOURCE_INFO = {
  facebook: {
    text: 'Facebook page',
    icon: () => <FacebookIcon />,
    avatar: () => <MessengerAvatar />,
  },
  google: {
    text: 'Google page',
    icon: () => <GoogleIcon />,
    avatar: () => <GoogleAvatar />,
  },
  'twilio.sms': {
    text: 'SMS phone number',
    icon: () => <SmsIcon />,
    avatar: () => <SmsAvatar />,
  },
  'twilio.whatsapp': {
    text: 'WhatsApp number',
    icon: () => <WhatsappIcon />,
    avatar: () => <WhatsappAvatar />,
  },
  chatplugin: {
    text: 'Airy Live Chat plugin',
    icon: () => <AiryIcon />,
    avatar: () => <AiryAvatar />,
  },
};

const IconChannel: React.FC<IconChannelProps> = ({
  channel,
  icon,
  showAvatar,
  showName,
  text,
}: IconChannelProps): JSX.Element => {
  if (!channel) {
    channel = PlaceholderChannelData;
  }

  const channelInfo = SOURCE_INFO[channel.source];
  const fbFallback = SOURCE_INFO['facebook'];

  if (icon && showName) {
    return (
      <div className={styles.iconName}>
        {channelInfo.icon()}
        <p>{channel.metadata?.name}</p>
      </div>
    );
  }

  if (showAvatar && showName) {
    return (
      <div className={styles.avatarName}>
        {channelInfo.avatar()}
        <p>{channel.metadata?.name}</p>
      </div>
    );
  }

  if (icon && text) {
    return (
      <div className={styles.iconText}>
        {channelInfo.icon()}
        <p>{channelInfo.text}</p>
      </div>
    );
  }

  if (showAvatar && text) {
    return (
      <div className={styles.avatarText}>
        {channelInfo.avatar()}
        <p>{channelInfo.text}</p>
      </div>
    );
  }

  if (icon) {
    return <>{channelInfo.icon()}</>;
  }

  if (showAvatar) {
    return <>{channelInfo.avatar()}</>;
  }

  return (
    <>
      {' '}
      {fbFallback.icon()} {fbFallback.text}{' '}
    </>
  );
};

export default IconChannel;
