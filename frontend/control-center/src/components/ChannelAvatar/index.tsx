import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as FacebookAvatar} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as InstagramAvatar} from 'assets/images/icons/instagramLogoFilled.svg';
import {ReactComponent as TwilioAvatar} from 'assets/images/icons/twilioLogo.svg';
import {ReactComponent as ViberAvatar} from 'assets/images/icons/viberLogoFilled.svg';
import {ReactComponent as ZendeskAvatar} from 'assets/images/icons/zendeskLogo.svg';
import {ReactComponent as DialogflowAvatar} from 'assets/images/icons/dialogflowLogo.svg';
import {Channel, Source} from 'model';
import styles from './index.module.scss';

type ChannelAvatarProps = {
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

export const getChannelAvatar = (source: string) => {
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
    case Source.zendesk:
      return <ZendeskAvatar />;
    case Source.dialogflow:
      return <DialogflowAvatar />;
    default:
      return <AiryAvatar />;
  }
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

  return (
    <div className={styles.image} style={style}>
      {channel.metadata?.imageUrl || imageUrl ? getCustomLogo(channel) : getChannelAvatar(channel.source)}
    </div>
  );
};

export default ChannelAvatar;
