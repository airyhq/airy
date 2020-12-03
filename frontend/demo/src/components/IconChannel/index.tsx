import React from 'react';
import {ReactSVG} from 'react-svg';
import {Channel} from '../../model/Channel';

import fbIcon from '../../assets/images/icons/facebook_rounded.svg';
import googleIcon from '../../assets/images/icons/google-messages.svg';
import smsIcon from '../../assets/images/icons/sms-icon.svg';
import whatsappIcon from '../../assets/images/icons/whatsapp-icon.svg';
import messengerAvatar from '../../assets/images/icons/messenger_avatar.svg';
import googleAvatar from '../../assets/images/icons/google_avatar.svg';
import smsAvatar from '../../assets/images/icons/sms_avatar.svg';
import whatsappAvatar from '../../assets/images/icons/whatsapp_avatar.svg';
import airyAvatar from '../../assets/images/icons/airy_avatar.svg';
import airyIcon from '../../assets/images/icons/airy-icon.svg';

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
  external_channel_id: 'external_channel_id',
};

const IconChannel = ({channel, icon, avatar, name, text}: IconChannelProps) => {
  if (!channel) {
    channel = PlaceholderChannelData;
  }

  const SOURCE_INFO = {
    FACEBOOK: {text: 'Facebook page', icon: fbIcon, avatar: messengerAvatar, name: channel.name},
    GOOGLE: {text: 'Google page', icon: googleIcon, avatar: googleAvatar, name: channel.name},
    SMS_TWILIO: {text: 'SMS page', icon: smsIcon, avatar: smsAvatar, name: channel.name},
    WHATSAPP_TWILIO: {text: 'Whatsapp page', icon: whatsappIcon, avatar: whatsappAvatar, name: channel.name},
    SELF: {text: 'Airy Chat plugin', icon: airyIcon, avatar: airyAvatar, name: channel.name},
  };

  const channelInfo = SOURCE_INFO[channel.source];
  const fbFallback = SOURCE_INFO['FACEBOOK'];

  if (!channelInfo) {
    return (
      <>
        <ReactSVG src={fbFallback.icon} /> {fbFallback.text}
      </>
    );
  }

  if (icon && name) {
    return (
      <div className={styles.iconName}>
        <ReactSVG src={channelInfo.icon} />
        <p>{channelInfo.name}</p>
      </div>
    );
  } else if (avatar && name) {
    return (
      <div className={styles.avatarName}>
        <ReactSVG src={channelInfo.avatar} />
        <p>{channelInfo.name}</p>
      </div>
    );
  } else if (icon && text) {
    return (
      <div className={styles.iconText}>
        <ReactSVG src={channelInfo.icon} />
        <p>{channelInfo.text}</p>
      </div>
    );
  } else if (avatar && text) {
    return (
      <div className={styles.avatarText}>
        <ReactSVG src={channelInfo.avatar} />
        <p>{channelInfo.text}</p>
      </div>
    );
  } else if (icon) {
    return (
      <>
        <ReactSVG src={channelInfo.icon} />
      </>
    );
  } else if (avatar) {
    return (
      <>
        <ReactSVG src={channelInfo.avatar} />
      </>
    );
  }
  return (
    <>
      <ReactSVG src={fbFallback.icon} /> {fbFallback.text}
    </>
  );
};

export default IconChannel;
