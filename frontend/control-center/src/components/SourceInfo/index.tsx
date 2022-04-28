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
    cyChannelsChatPluginList,
    cyChannelsFacebookAddButton,
    cyChannelsFacebookList,
    cyChannelsGoogleAddButton,
    cyChannelsGoogleList,
    cyChannelsTwilioSmsAddButton,
    cyChannelsTwilioSmsList,
    cyChannelsTwilioWhatsappAddButton,
    cyChannelsTwilioWhatsappList,
    cyChannelsInstagramAddButton,
    cyChannelsInstagramList,
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
    title: string;
    description: string;
    image: JSX.Element;
    newChannelRoute: string;
    channelsListRoute: string;
    configKey: string;
    channelsToShow: number;
    itemInfoString: string;
    dataCyAddChannelButton: string;
    dataCyChannelList: string;
  };


  const getSourcesInfo = (page: string):SourceInfo[] => {

    return [
        {
          type: Source.chatPlugin,
          title: 'Airy Live Chat',
          description: 'Best of class browser messenger',
          image: <AiryAvatarIcon />,
          newChannelRoute: CATALOG_CHAT_PLUGIN_ROUTE + '/new',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/chatplugin',
          configKey: 'sources-chat-plugin',
          channelsToShow: 4,
          itemInfoString: 'channels',
          dataCyAddChannelButton: cyChannelsChatPluginAddButton,
          dataCyChannelList: cyChannelsChatPluginList,
        },
        {
          type: Source.facebook,
          title: 'Messenger',
          description: 'Connect multiple Facebook pages',
          image: <MessengerAvatarIcon />,
          newChannelRoute: CATALOG_FACEBOOK_ROUTE + '/new',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/facebook',
          configKey: 'sources-facebook',
          channelsToShow: 4,
          itemInfoString: 'channels',
          dataCyAddChannelButton: cyChannelsFacebookAddButton,
          dataCyChannelList: cyChannelsFacebookList,
        },
        {
          type: Source.twilioSMS,
          title: 'SMS',
          description: 'Deliver SMS with ease',
          image: <SMSAvatarIcon />,
          newChannelRoute: CATALOG_TWILIO_SMS_ROUTE + '/new_account',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/twilio.sms/#',
          configKey: 'sources-twilio',
          channelsToShow: 2,
          itemInfoString: 'phones',
          dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
          dataCyChannelList: cyChannelsTwilioSmsList,
        },
        {
          type: Source.twilioWhatsApp,
          title: 'WhatsApp',
          description: 'World #1 chat app',
          image: <WhatsAppAvatarIcon />,
          newChannelRoute: CATALOG_TWILIO_WHATSAPP_ROUTE + '/new_account',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/twilio.whatsapp/#',
          configKey: 'sources-twilio',
          channelsToShow: 2,
          itemInfoString: 'phones',
          dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
          dataCyChannelList: cyChannelsTwilioWhatsappList,
        },
        {
          type: Source.google,
          title: 'Google Business Messages',
          description: 'Be there when people search',
          image: <GoogleAvatarIcon />,
          newChannelRoute: CATALOG_GOOGLE_ROUTE + '/new_account',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/google',
          configKey: 'sources-google',
          channelsToShow: 4,
          itemInfoString: 'channels',
          dataCyAddChannelButton: cyChannelsGoogleAddButton,
          dataCyChannelList: cyChannelsGoogleList,
        },
        {
          type: Source.instagram,
          title: 'Instagram',
          description: 'Connect multiple Instagram pages',
          image: <InstagramIcon />,
          newChannelRoute: CATALOG_INSTAGRAM_ROUTE + '/new',
          channelsListRoute: CATALOG_CONNECTED_ROUTE + '/instagram',
          configKey: 'sources-facebook',
          channelsToShow: 4,
          itemInfoString: 'channels',
          dataCyAddChannelButton: cyChannelsInstagramAddButton,
          dataCyChannelList: cyChannelsInstagramList,
        },
      ];


  }


  const SourcesInfo: SourceInfo[] = [
    {
      type: Source.chatPlugin,
      title: 'Airy Live Chat',
      description: 'Best of class browser messenger',
      image: <AiryAvatarIcon />,
      newChannelRoute: CATALOG_CHAT_PLUGIN_ROUTE + '/new',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/chatplugin',
      configKey: 'sources-chat-plugin',
      channelsToShow: 4,
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsChatPluginAddButton,
      dataCyChannelList: cyChannelsChatPluginList,
    },
    {
      type: Source.facebook,
      title: 'Messenger',
      description: 'Connect multiple Facebook pages',
      image: <MessengerAvatarIcon />,
      newChannelRoute: CATALOG_FACEBOOK_ROUTE + '/new',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/facebook',
      configKey: 'sources-facebook',
      channelsToShow: 4,
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsFacebookAddButton,
      dataCyChannelList: cyChannelsFacebookList,
    },
    {
      type: Source.twilioSMS,
      title: 'SMS',
      description: 'Deliver SMS with ease',
      image: <SMSAvatarIcon />,
      newChannelRoute: CATALOG_TWILIO_SMS_ROUTE + '/new_account',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/twilio.sms/#',
      configKey: 'sources-twilio',
      channelsToShow: 2,
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
      dataCyChannelList: cyChannelsTwilioSmsList,
    },
    {
      type: Source.twilioWhatsApp,
      title: 'WhatsApp',
      description: 'World #1 chat app',
      image: <WhatsAppAvatarIcon />,
      newChannelRoute: CATALOG_TWILIO_WHATSAPP_ROUTE + '/new_account',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/twilio.whatsapp/#',
      configKey: 'sources-twilio',
      channelsToShow: 2,
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
      dataCyChannelList: cyChannelsTwilioWhatsappList,
    },
    {
      type: Source.google,
      title: 'Google Business Messages',
      description: 'Be there when people search',
      image: <GoogleAvatarIcon />,
      newChannelRoute: CATALOG_GOOGLE_ROUTE + '/new_account',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/google',
      configKey: 'sources-google',
      channelsToShow: 4,
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsGoogleAddButton,
      dataCyChannelList: cyChannelsGoogleList,
    },
    {
      type: Source.instagram,
      title: 'Instagram',
      description: 'Connect multiple Instagram pages',
      image: <InstagramIcon />,
      newChannelRoute: CATALOG_INSTAGRAM_ROUTE + '/new',
      channelsListRoute: CATALOG_CONNECTED_ROUTE + '/instagram',
      configKey: 'sources-facebook',
      channelsToShow: 4,
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsInstagramAddButton,
      dataCyChannelList: cyChannelsInstagramList,
    },
  ];