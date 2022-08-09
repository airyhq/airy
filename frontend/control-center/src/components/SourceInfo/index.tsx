import React from 'react';
import {Source} from 'model';
import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramLogoFilled.svg';
import {ReactComponent as DialogflowIcon} from 'assets/images/icons/dialogflowLogo.svg';
import {ReactComponent as ZendeskIcon} from 'assets/images/icons/zendeskLogo.svg';
import {ReactComponent as SalesforceIcon} from 'assets/images/icons/salesforceLogo.svg';
import {useTranslation} from 'react-i18next';
import {
  cyChannelsChatPluginAddButton,
  cyChannelsFacebookAddButton,
  cyChannelsGoogleAddButton,
  cyChannelsTwilioSmsAddButton,
  cyChannelsTwilioWhatsappAddButton,
  cyChannelsInstagramAddButton,
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
  CONNECTORS_ZENDESK_ROUTE,
  CONNECTORS_SALESFORCE_ROUTE,
} from '../../routes/routes';

export type SourceInfo = {
  type: Source;
  channel: boolean;
  title: string;
  description: string | JSX.Element;
  image: JSX.Element;
  newChannelRoute: string;
  channelsListRoute: string;
  configKey: string;
  componentName: string;
  repository: string;
  itemInfoString: string;
  dataCyAddChannelButton?: string;
  docs: string;
};

interface DescriptionComponentProps {
  description: string;
}

const DescriptionComponent = (props: DescriptionComponentProps) => {
  const {description} = props;
  const {t} = useTranslation();
  return <>{t(description)}</>;
};

export const getSourcesInfo = (): SourceInfo[] => {
  return [
    {
      type: Source.chatPlugin,
      channel: true,
      title: 'Airy Live Chat',
      description: <DescriptionComponent description="chatpluginDescription" />,
      image: <AiryAvatarIcon />,
      newChannelRoute: CONNECTORS_CHAT_PLUGIN_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/chatplugin',
      configKey: 'sources-chatplugin',
      componentName: 'sources-chatplugin',
      repository: 'airy-core',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsChatPluginAddButton,
      docs: 'https://airy.co/docs/core/sources/chatplugin/overview',
    },
    {
      type: Source.facebook,
      channel: true,
      title: 'Messenger',
      description: <DescriptionComponent description="facebookDescription" />,
      image: <MessengerAvatarIcon />,
      newChannelRoute: CONNECTORS_FACEBOOK_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/facebook',
      configKey: 'sources-facebook',
      componentName: 'sources-facebook',
      repository: 'airy-core',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsFacebookAddButton,
      docs: 'https://airy.co/docs/core/sources/facebook',
    },
    {
      type: Source.twilioSMS,
      channel: true,
      title: 'SMS',
      description: <DescriptionComponent description="twilioSmsDescription" />,
      image: <SMSAvatarIcon />,
      newChannelRoute: CONNECTORS_TWILIO_SMS_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.sms/#',
      configKey: 'sources-twilio',
      componentName: 'sources-twilio',
      repository: 'airy-core',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
      docs: 'https://airy.co/docs/core/sources/sms-twilio',
    },
    {
      type: Source.twilioWhatsApp,
      channel: true,
      title: 'WhatsApp',
      description: <DescriptionComponent description="twilioWhatsappDescription" />,
      image: <WhatsAppAvatarIcon />,
      newChannelRoute: CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
      configKey: 'sources-twilio',
      componentName: 'sources-twilio',
      repository: 'airy-core',
      itemInfoString: 'phones',
      dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
      docs: 'https://airy.co/docs/core/sources/whatsapp-twilio',
    },
    {
      type: Source.google,
      channel: true,
      title: 'Google Business Messages',
      description: <DescriptionComponent description="googleDescription" />,
      image: <GoogleAvatarIcon />,
      newChannelRoute: CONNECTORS_GOOGLE_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/google',
      configKey: 'sources-google',
      componentName: 'sources-google',
      repository: 'airy-core',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsGoogleAddButton,
      docs: 'https://airy.co/docs/core/sources/google',
    },
    {
      type: Source.instagram,
      channel: true,
      title: 'Instagram',
      description: <DescriptionComponent description="instagramDescription" />,
      image: <InstagramIcon />,
      newChannelRoute: CONNECTORS_INSTAGRAM_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/instagram',
      configKey: 'sources-facebook',
      componentName: 'sources-facebook',
      repository: 'airy-core',
      itemInfoString: 'channels',
      dataCyAddChannelButton: cyChannelsInstagramAddButton,
      docs: 'https://airy.co/docs/core/sources/instagram',
    },
    {
      type: Source.dialogflow,
      channel: false,
      title: 'Dialogflow',
      description: <DescriptionComponent description="dialogflowDescription" />,
      image: <DialogflowIcon />,
      newChannelRoute: CONNECTORS_DIALOGFLOW_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/dialogflow',
      configKey: 'enterprise-dialogflow-connector',
      componentName: 'enterprise-dialogflow-connector',
      repository: 'airy-enterprise',
      itemInfoString: 'connectors',
      docs: 'https://dialogflow.cloud.google.com/cx/projects',
    },
    {
      type: Source.zendesk,
      channel: false,
      title: 'Zendesk',
      description: <DescriptionComponent description="zendeskDescription" />,
      image: <ZendeskIcon />,
      newChannelRoute: CONNECTORS_ZENDESK_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/zendesk',
      configKey: 'enterprise-zendesk-connector',
      componentName: 'enterprise-zendesk-connector',
      repository: 'airy-enterprise',
      itemInfoString: 'connectors',
      docs: 'https://airy.co/docs/enterprise/apps/zendesk/installation',
    },
    {
      type: Source.salesforce,
      channel: false,
      title: 'Salesforce',
      description: <DescriptionComponent description="salesforceDescription" />,
      image: <SalesforceIcon />,
      newChannelRoute: CONNECTORS_SALESFORCE_ROUTE + '/new',
      channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/salesforce',
      configKey: 'enterprise-salesforce-contacts-ingestion',
      componentName: 'enterprise-salesforce-contacts-ingestion',
      repository: 'airy-enterprise',
      itemInfoString: 'connectors',
      docs: 'https://airy.co/docs/enterprise/apps/salesforce-contacts-ingestion/deployment',
    },
  ];
};
