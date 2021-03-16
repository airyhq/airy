import React, {SyntheticEvent} from 'react';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as SmsLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {Channel, ChannelSource} from 'httpclient';
import styles from './index.module.scss';

type SourceLogoProps = {
  channel: Channel;
  imageHeight: number;
  imageWidth: number;
  imageUrl?: string;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
};

export const fallbackImageUrl = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;
  event.currentTarget.alt = 'fallback image';
};

const SourceLogo = (props: SourceLogoProps) => {
  const {
    channel,
    imageUrl,
    imageHeight,
    imageWidth,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;

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
      case ChannelSource.facebook:
        return <FacebookLogo />;
      case ChannelSource.google:
        return <GoogleLogo />;
      case ChannelSource.twilioSMS:
        return <SmsLogo />;
      case ChannelSource.twilioWhatsapp:
        return <WhatsappLogo />;
      default:
        return <AiryLogo />;
    }
  };

  return (
    <div
      className={styles.image}
      style={{
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        marginTop: `${marginTop}px`,
        marginRight: `${marginRight}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        paddingTop: `${paddingTop}px`,
        paddingRight: `${paddingRight}`,
        paddingBottom: `${paddingBottom}`,
        paddingLeft: `${paddingLeft}`,
      }}>
      {channel?.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getSourceLogo(channel)}
    </div>
  );
};

export default SourceLogo;
