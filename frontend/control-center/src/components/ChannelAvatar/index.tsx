import React, {CSSProperties, SyntheticEvent} from 'react';
import {ReactComponent as GoogleAvatar} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as WhatsappAvatar} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as SmsAvatar} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as FacebookAvatar} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as InstagramAvatar} from 'assets/images/icons/instagramLogoFilled.svg';
import {ReactComponent as TwilioAvatar} from 'assets/images/icons/twilioLogo.svg';
import {ReactComponent as ViberAvatar} from 'assets/images/icons/viber.svg';
import {ReactComponent as ZendeskAvatar} from 'assets/images/icons/zendeskLogo.svg';
import {ReactComponent as DialogflowAvatar} from 'assets/images/icons/dialogflowLogo.svg';
import {ReactComponent as SalesforceAvatar} from 'assets/images/icons/salesforceLogo.svg';
import {ReactComponent as CognigyAvatar} from 'assets/images/icons/cognigyLogo.svg';
import {ReactComponent as RasaAvatar} from 'assets/images/icons/rasaLogo.svg';
import {ReactComponent as AmeliaAvatar} from 'assets/images/icons/ameliaLogo.svg';
import {ReactComponent as AmazonS3Avatar} from 'assets/images/icons/amazons3Logo.svg';
import {ReactComponent as AmazonLexV2Avatar} from 'assets/images/icons/amazonLexV2Logo.svg';
import {ReactComponent as IbmWatsonAssistantAvatar} from 'assets/images/icons/ibmWatsonAssistantLogo.svg';
import {ReactComponent as RedisAvatar} from 'assets/images/icons/redisLogo.svg';
import {ReactComponent as PostgresAvatar} from 'assets/images/icons/postgresLogo.svg';

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
    case 'Facebook Messenger':
      return <FacebookAvatar />;
    case Source.google:
    case 'Google Business Messages':
      return <GoogleAvatar />;
    case Source.twilioSMS:
    case 'Twilio SMS':
      return <SmsAvatar />;
    case Source.twilioWhatsApp:
    case Source.whatsapp:
    case 'WhatsApp Business Cloud':
      return <WhatsappAvatar />;
    case Source.twilio:
      return <TwilioAvatar />;
    case Source.instagram:
    case 'Instagram':
      return <InstagramAvatar />;
    case Source.viber:
    case 'Viber':
      return <ViberAvatar />;
    case Source.zendesk:
    case 'Zendesk':
      return <ZendeskAvatar />;
    case Source.dialogflow:
    case 'Dialogflow':
      return <DialogflowAvatar />;
    case Source.salesforce:
    case 'Salesforce':
      return <SalesforceAvatar />;
    case Source.cognigy:
    case 'Cognigy.AI':
      return <CognigyAvatar />;
    case Source.rasa:
    case 'Rasa':
      return <RasaAvatar />;
    case Source.amelia:
    case 'Amelia':
      return <AmeliaAvatar />;
    case Source.amazons3:
    case 'Amazon S3':
      return <AmazonS3Avatar />;
    case Source.amazonLexV2:
    case 'Amazon LEX V2':
      return <AmazonLexV2Avatar />;
    case Source.ibmWatsonAssistant:
    case 'IBM Watson Assistant':
      return <IbmWatsonAssistantAvatar />;
    case Source.redis:
    case 'Redis':
      return <RedisAvatar />;
    case Source.postgres:
    case 'PostgreSQL':
      return <PostgresAvatar />;

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
