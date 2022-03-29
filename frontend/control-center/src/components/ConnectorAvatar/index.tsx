import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/googleCCLogo.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsappCCLogo.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/twilioSmsCCLogo.svg';
import {ReactComponent as FacebookAvatar} from 'assets/images/icons/facebookMessengerCCLogo.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airyCCLogo.svg';
import {ReactComponent as InstagramAvatar} from 'assets/images/icons/instagramCCLogo.svg';
import {Channel, Source} from 'model';
import styles from './index.module.scss';

type ConnectorAvatarProps = {
  channel: Channel;
  style?: CSSProperties;
  imageUrl?: string;
};

const fallbackImageUrl = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  if (source === Source.facebook) {
    event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${Source.facebook}CC_avatar.svg`;
    event.currentTarget.alt = `${Source.facebook} fallback image`;
  } else {
    event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;
    event.currentTarget.alt = `${source} fallback image`;
  }
};

const ConnectorAvatar = (props: ConnectorAvatarProps) => {
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

  const getConnectorAvatar = (channel: Channel) => {
    switch (channel.source) {
      case Source.facebook:
        return <FacebookAvatar />;
      case Source.google:
        return <GoogleAvatar />;
      case Source.twilioSMS:
        return <SmsAvatar />;
      case Source.twilioWhatsApp:
        return <WhatsappAvatar />;
      case Source.instagram:
        return <InstagramAvatar />;
      default:
        return <AiryAvatar />;
    }
  };

  return (
    <div className={styles.image} style={style}>
      {channel.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getConnectorAvatar(channel)}
    </div>
  );
};

export default ConnectorAvatar;
