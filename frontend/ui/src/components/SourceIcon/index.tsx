import React from 'react';

import {ReactComponent as GoogleIcon} from 'assets/images/icons/googleAvatar.svg';
import {ReactComponent as WhatsappIcon} from 'assets/images/icons/whatsAppAvatar.svg';
import {ReactComponent as SmsIcon} from 'assets/images/icons/smsAvatar.svg';
import {ReactComponent as FacebookIcon} from 'assets/images/icons/messengerAvatar.svg';
import {ReactComponent as AiryAvatar} from 'assets/images/icons/airyAvatar.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramAvatar.svg';
import {ReactComponent as BubbleIcon} from 'assets/images/icons/bubble.svg';

const sourceIconsMap = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  'twilio.sms': SmsIcon,
  'twilio.whatsapp': WhatsappIcon,
  chatplugin: AiryAvatar,
  instagram: InstagramIcon,
  unknown: BubbleIcon,
};

export const SourceIcon = ({source, ...props}) => {
  const SourceIcon = sourceIconsMap[source] ?? sourceIconsMap['unknown'];
  return <SourceIcon {...props} />;
};
