import React from 'react';
import {Source} from 'model';
import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramLogoFilled.svg';
import {ReactComponent as DialogflowIcon} from 'assets/images/icons/dialogflowLogo.svg';
import {
  cyChannelsChatPluginAddButton,
  cyChannelsFacebookAddButton,
  cyChannelsGoogleAddButton,
  cyChannelsTwilioSmsAddButton,
  cyChannelsTwilioWhatsappAddButton,
  cyChannelsInstagramAddButton,
  cyChannelsDialogflowAddButton,
} from 'handles';
import {
  CONNECTORS_CONNECTED_ROUTE,
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
  CONNECTORS_DIALOGFLOW_ROUTE,
} from '../../routes/routes';

export type SourceInfo = {
  type: Source;
  channel: boolean;
  title: string;
  description: string;
  image: JSX.Element;
  newChannelRoute: string;
  channelsListRoute: string;
  configKey: string;
  itemInfoString: string;
  dataCyAddChannelButton: string;
  docs: string;
};

export const getSourcesInfo = (): SourceInfo[] => {
  return [
    {
      type: Source.chatPlugin,
      channel: true,
      title: 'Airy Live Chat',
      description: 'Best of class browser messenger',
      image: <AiryAvatarIcon />,
      newChannelRoute: CONNECTORS_CHAT_PLUGIN_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/chatplugin',
      configKey: 'sources-chat-plugin',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsChatPluginAddButton,
      docs: 'https://airy.co/docs/core/sources/chatplugin/overview',
    },
    {
      type: Source.facebook,
      channel: true,
      title: 'Messenger',
      description: 'Connect multiple Facebook pages',
      image: <MessengerAvatarIcon />,
      newChannelRoute: CONNECTORS_FACEBOOK_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/facebook',
      configKey: 'sources-facebook',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsFacebookAddButton,
      docs: 'https://airy.co/docs/core/sources/facebook',
    },
    {
      type: Source.twilioSMS,
      channel: true,
      title: 'SMS',
      description: 'Deliver SMS with ease',
      image: <SMSAvatarIcon />,
      newChannelRoute: CONNECTORS_TWILIO_SMS_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.sms/#',
      configKey: 'sources-twilio',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
      docs: 'https://airy.co/docs/core/sources/sms-twilio',
    },
    {
      type: Source.twilioWhatsApp,
      channel: true,
      title: 'WhatsApp',
      description: 'World #1 chat app',
      image: <WhatsAppAvatarIcon />,
      newChannelRoute: CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
      configKey: 'sources-twilio',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
      docs: 'https://airy.co/docs/core/sources/whatsapp-twilio',
    },
    {
      type: Source.google,
      channel: true,
      title: 'Google Business Messages',
      description: 'Be there when people search',
      image: <GoogleAvatarIcon />,
      newChannelRoute: CONNECTORS_GOOGLE_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/google',
      configKey: 'sources-google',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsGoogleAddButton,
      docs: 'https://airy.co/docs/core/sources/google',
    },
    {
      type: Source.instagram,
      channel: true,
      title: 'Instagram',
      description: 'Connect multiple Instagram pages',
      image: <InstagramIcon />,
      newChannelRoute: CONNECTORS_INSTAGRAM_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/instagram',
      configKey: 'sources-facebook',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsInstagramAddButton,
      docs: 'https://airy.co/docs/core/sources/instagram',
    },
    {
      type: Source.dialogflow,
      channel: false,
      title: 'Dialogflow',
      description: 'Conversational AI with virtual agents',
      image: <DialogflowIcon />,
      newChannelRoute: CONNECTORS_DIALOGFLOW_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/dialogflow',
      configKey: 'enterprise-dialogflow-connector',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsDialogflowAddButton,
      docs: 'https://dialogflow.cloud.google.com/cx/projects',
    },
  ];
};
