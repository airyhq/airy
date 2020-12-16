import React from 'react';
import {Channel} from '../../model/Channel';

import {ReactComponent as FacebookIcon} from '../../assets/images/icons/facebook_rounded.svg';
import {ReactComponent as GoogleIcon} from '../../assets/images/icons/google-messages.svg';
import {ReactComponent as SmsIcon} from '../../assets/images/icons/sms-icon.svg';
import {ReactComponent as WhatsappIcon} from '../../assets/images/icons/whatsapp-icon.svg';
import {ReactComponent as MessengerAvatar} from '../../assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleAvatar} from '../../assets/images/icons/google_avatar.svg';
import {ReactComponent as SmsAvatar} from '../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappAvatar} from '../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryAvatar} from '../../assets/images/icons/airy_avatar.svg';
import {ReactComponent as AiryIcon} from '../../assets/images/icons/airy-icon.svg';

import styles from './style.module.scss';

type IconChannelProps = {
  channel: Channel;
  icon?: boolean;
  avatar?: boolean;
  name?: boolean;
  text?: boolean;
};

const PlaceholderChannelData = {
  id: 'id',
  name: 'Retriving Data...',
  source: 'FACEBOOK',
  sourceChannelId: 'external_channel_id',
  connected: true,
};

const IconChannel = ({channel, icon, avatar, name, text}: IconChannelProps) => {
  if (!channel) {
    channel = PlaceholderChannelData;
  }

  const SOURCE_INFO = {
    facebook: {
      text: 'Facebook page',
      icon: function() {
        return <FacebookIcon />;
      },
      avatar: function() {
        return <MessengerAvatar />;
      },
      name: channel.name,
    },
    google: {
      text: 'Google page',
      icon: function() {
        return <GoogleIcon />;
      },
      avatar: function() {
        return <GoogleAvatar />;
      },
      name: channel.name,
    },
    'twilio.sms': {
      text: 'SMS page',
      icon: function() {
        return <SmsIcon />;
      },
      avatar: function() {
        return <SmsAvatar />;
      },
      name: channel.name,
    },
    'twilio.whatsapp': {
      text: 'Whatsapp page',
      icon: function() {
        return <WhatsappIcon />;
      },
      avatar: function() {
        return <WhatsappAvatar />;
      },
      name: channel.name,
    },
    chat_plugin: {
      text: 'Airy Chat plugin',
      icon: function() {
        return <AiryIcon />;
      },
      avatar: function() {
        return <AiryAvatar />;
      },
      name: channel.name,
    },
  };

  //TODO: This has to go once the backend returns the source
  const channelInfo = SOURCE_INFO[channel.source || 'chat_plugin'];
  const fbFallback = SOURCE_INFO['FACEBOOK'];

  if (!channelInfo) {
    return (
      <>
        {fbFallback.icon()} {fbFallback.text}
      </>
    );
  }

  if (icon && name) {
    return (
      <div className={styles.iconName}>
        {channelInfo.icon()}
        <p>{channelInfo.name}</p>
      </div>
    );
  } else if (avatar && name) {
    return (
      <div className={styles.avatarName}>
        {channelInfo.avatar()}
        <p>{channelInfo.name}</p>
      </div>
    );
  } else if (icon && text) {
    return (
      <div className={styles.iconText}>
        {channelInfo.icon()}
        <p>{channelInfo.text}</p>
      </div>
    );
  } else if (avatar && text) {
    return (
      <div className={styles.avatarText}>
        {channelInfo.avatar()}
        <p>{channelInfo.text}</p>
      </div>
    );
  } else if (icon) {
    return <>{channelInfo.icon()}</>;
  } else if (avatar) {
    return <>{channelInfo.avatar()}</>;
  }
  return (
    <>
      {fbFallback.icon()} {fbFallback.text}
    </>
  );
};

export default IconChannel;
