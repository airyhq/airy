import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as FacebookAvatar} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airy_avatar.svg';
import {Channel, Source} from 'model';
import styles from './index.module.scss';

type ChannelAvatarProps = {
  channel: Channel;
  style?: CSSProperties;
  imageUrl?: string;
};

const fallbackImageUrl = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;
  event.currentTarget.alt = `${source} fallback image`;
};

const ChannelAvatar = (props: ChannelAvatarProps) => {
  const {channel, imageUrl, style} = props;

  const getCustomLogo = (channel: Channel) => {
    return (
      <img
        onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackImageUrl(event, channel.source)}
        src={channel.metadata.imageUrl || imageUrl}
        alt={channel.metadata.name || 'SourceLogo'}
      />
    );
  };

  const getChannelAvatar = (channel: Channel) => {
    switch (channel.source) {
      case Source.facebook:
        return <FacebookAvatar />;
      case Source.google:
        return <GoogleAvatar />;
      case Source.twilioSMS:
        return <SmsAvatar />;
      case Source.twilioWhatsApp:
        return <WhatsappAvatar />;
      default:
        return <AiryAvatar />;
    }
  };

  return (
    <div className={styles.image} style={style}>
      {channel.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getChannelAvatar(channel)}
    </div>
  );
};

export default ChannelAvatar;
