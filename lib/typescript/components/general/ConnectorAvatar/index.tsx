import React, {CSSProperties} from 'react';
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
import {Source} from 'model';
import styles from './index.module.scss';

type ConnectorAvatarProps = {
  source: Source;
  style?: CSSProperties;
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
    case Source.twilio:
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

export const ConnectorAvatar = (props: ConnectorAvatarProps) => {
  const {source, style} = props;
  return (
    <div className={styles.image} style={style}>
      {getConnectorAvatar(source)}
    </div>
  );
};
