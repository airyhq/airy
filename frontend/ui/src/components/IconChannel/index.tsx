/* eslint-disable react/display-name */
import React from 'react';
import {Channel} from 'model';

import {ReactComponent as FacebookIcon} from 'assets/images/icons/facebook_rounded.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagram.svg';
import {ReactComponent as GoogleIcon} from 'assets/images/icons/google-messages.svg';
import {ReactComponent as SmsIcon} from 'assets/images/icons/sms-icon.svg';
import {ReactComponent as WhatsappIcon} from 'assets/images/icons/whatsapp-icon.svg';
import {ReactComponent as MessengerAvatar} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as AiryIcon} from 'assets/images/icons/airy-icon.svg';
import {ReactComponent as ViberIcon} from 'assets/images/icons/viber.svg';

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
  instagram: {
    text: 'Instagram Account',
    icon: () => <InstagramIcon />,
    avatar: () => <InstagramIcon />,
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
  viber: {
    text: 'Viber',
    icon: () => <ViberIcon />,
    avatar: () => <ViberIcon />,
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
  const isFromTwilioSource = channel.source === 'twilio.sms' || channel.source === 'twilio.whatsapp';

  const ChannelName = () => {
    return <p>{channel.metadata?.name || (isFromTwilioSource ? channel.sourceChannelId : channel.source)}</p>;
  };

  if (icon && showName) {
    return (
      <div className={styles.iconName}>
        {channelInfo.icon()}
        <ChannelName />
      </div>
    );
  }

  if (showAvatar && showName) {
    return (
      <div className={styles.avatarName}>
        {channelInfo.avatar()}
        <ChannelName />
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
