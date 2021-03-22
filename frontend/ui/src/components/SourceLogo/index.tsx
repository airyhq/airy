import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as SmsLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {Channel, SourceType} from 'httpclient';
import styles from './index.module.scss';

type SourceLogoProps = {
  channel: Channel;
  style?: CSSProperties;
  imageUrl?: string;
};

const fallbackImageUrl = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;
  event.currentTarget.alt = 'fallback image';
};

const SourceLogo = (props: SourceLogoProps) => {
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

  const getSourceLogo = (channel: Channel) => {
    switch (channel.source) {
      case SourceType.facebook:
        return <FacebookLogo />;
      case SourceType.google:
        return <GoogleLogo />;
      case SourceType.twilioSMS:
        return <SmsLogo />;
      case SourceType.twilioWhatsapp:
        return <WhatsappLogo />;
      default:
        return <AiryLogo />;
    }
  };

  return (
    <div className={styles.image} style={style}>
      {channel?.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getSourceLogo(channel)}
    </div>
  );
};

export default SourceLogo;
