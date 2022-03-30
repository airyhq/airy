import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/googleCCLogo.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsappCCLogo.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/twilioSmsCCLogo.svg';
import {ReactComponent as FacebookAvatar} from 'assets/images/icons/facebookMessengerCCLogo.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airyCCLogo.svg';
import {ReactComponent as InstagramAvatar} from 'assets/images/icons/instagramCCLogo.svg';
import {ReactComponent as TwilioAvatar} from 'assets/images/icons/twilioCCLogo.svg';
import {ReactComponent as ViberAvatar} from 'assets/images/icons/viberCCLogo.svg';
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

export const getConnectorAvatar = (source: string) => {
  switch (source) {
    case Source.facebook:
      return <FacebookAvatar />;
    case Source.google:
      return <GoogleAvatar />;
    case Source.twilioSMS:
      return <SmsAvatar />;
    case Source.twilioWhatsApp:
      return <WhatsappAvatar />;
    case 'twilio':
      return <TwilioAvatar />;
    case Source.instagram:
      return <InstagramAvatar />;
    case Source.viber:
      return <ViberAvatar />;
    default:
      return <AiryAvatar />;
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

  return (
    <div className={styles.image} style={style}>
      {channel.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getConnectorAvatar(channel.source)}
    </div>
  );
};

export default ConnectorAvatar;
