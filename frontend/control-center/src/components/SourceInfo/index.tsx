import React from 'react';
import {Source} from 'model';
import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramLogoFilled.svg';
import {
  cyChannelsChatPluginAddButton,
  cyChannelsFacebookAddButton,
  cyChannelsGoogleAddButton,
  cyChannelsTwilioSmsAddButton,
  cyChannelsTwilioWhatsappAddButton,
  cyChannelsInstagramAddButton,
} from 'handles';
import {
  CATALOG_FACEBOOK_ROUTE,
  CATALOG_TWILIO_SMS_ROUTE,
  CATALOG_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CONNECTED_ROUTE,
  CATALOG_CHAT_PLUGIN_ROUTE,
  CATALOG_GOOGLE_ROUTE,
  CATALOG_INSTAGRAM_ROUTE,
  CATALOG_CONNECTED_ROUTE,
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
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
};

export const getSourcesInfo = (page: string): SourceInfo[] => {
  const connectorsPage = page === 'Connectors';

  return [
    {
      type: Source.chatPlugin,
      channel: true,
      title: 'Airy Live Chat',
      description: 'Best of class browser messenger',
      image: <AiryAvatarIcon />,
      newChannelRoute: connectorsPage ? CONNECTORS_CHAT_PLUGIN_ROUTE + '/new' : CATALOG_CHAT_PLUGIN_ROUTE + '/new',
      channelsListRoute: connectorsPage
        ? CONNECTORS_CONNECTED_ROUTE + '/chatplugin'
        : CATALOG_CONNECTED_ROUTE + '/chatplugin',
      configKey: 'sources-chat-plugin',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsChatPluginAddButton,
    },
    {
      type: Source.facebook,
      channel: true,
      title: 'Messenger',
      description: 'Connect multiple Facebook pages',
      image: <MessengerAvatarIcon />,
      newChannelRoute: connectorsPage ? CONNECTORS_FACEBOOK_ROUTE + '/new' : CATALOG_FACEBOOK_ROUTE + '/new',
      channelsListRoute: connectorsPage
        ? CONNECTORS_CONNECTED_ROUTE + '/facebook'
        : CATALOG_CONNECTED_ROUTE + '/facebook',
      configKey: 'sources-facebook',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsFacebookAddButton,
    },
    {
      type: Source.twilioSMS,
      channel: true,
      title: 'SMS',
      description: 'Deliver SMS with ease',
      image: <SMSAvatarIcon />,
      newChannelRoute: connectorsPage ? CONNECTORS_TWILIO_SMS_ROUTE + '/new' : CATALOG_TWILIO_SMS_ROUTE + '/new',
      channelsListRoute: connectorsPage
        ? CONNECTORS_CONNECTED_ROUTE + '/twilio.sms/#'
        : CATALOG_CONNECTED_ROUTE + '/twilio.sms/#',
      configKey: 'sources-twilio',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
    },
    {
      type: Source.twilioWhatsApp,
      channel: true,
      title: 'WhatsApp',
      description: 'World #1 chat app',
      image: <WhatsAppAvatarIcon />,
      newChannelRoute: connectorsPage
        ? CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new'
        : CATALOG_TWILIO_WHATSAPP_ROUTE + '/new',
      channelsListRoute: connectorsPage
        ? CONNECTORS_CONNECTED_ROUTE + '/twilio.whatsapp/#'
        : CATALOG_CONNECTED_ROUTE + '/twilio.whatsapp/#',
      configKey: 'sources-twilio',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
    },
    {
      type: Source.google,
      channel: true,
      title: 'Google Business Messages',
      description: 'Be there when people search',
      image: <GoogleAvatarIcon />,
      newChannelRoute: connectorsPage ? CONNECTORS_GOOGLE_ROUTE + '/new' : CATALOG_GOOGLE_ROUTE + '/new',
      channelsListRoute: connectorsPage ? CONNECTORS_CONNECTED_ROUTE + '/google' : CATALOG_CONNECTED_ROUTE + '/google',
      configKey: 'sources-google',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsGoogleAddButton,
    },
    {
      type: Source.instagram,
      channel: true,
      title: 'Instagram',
      description: 'Connect multiple Instagram pages',
      image: <InstagramIcon />,
      newChannelRoute: connectorsPage ? CONNECTORS_INSTAGRAM_ROUTE + '/new' : CATALOG_INSTAGRAM_ROUTE + '/new',
      channelsListRoute: connectorsPage
        ? CONNECTORS_CONNECTED_ROUTE + '/instagram'
        : CATALOG_CONNECTED_ROUTE + '/instagram',
      configKey: 'sources-facebook',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsInstagramAddButton,
    },
  ];
};
