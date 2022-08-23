import {
  CONNECTORS_CHAT_PLUGIN_CONNECTED_ROUTE,
  CONNECTORS_FACEBOOK_CONNECTED_ROUTE,
  CONNECTORS_TWILIO_SMS_CONNECTED_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_CONNECTED_ROUTE,
  CONNECTORS_WHATSAPP_BUSINESS_CLOUD_CONNECTED_ROUTE,
  CONNECTORS_GOOGLE_CONNECTED_ROUTE,
  CONNECTORS_INSTAGRAM_CONNECTED_ROUTE,
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
  CONNECTORS_DIALOGFLOW_ROUTE,
  CONNECTORS_ZENDESK_ROUTE,
  CONNECTORS_SALESFORCE_ROUTE,
  CONNECTORS_WHATSAPP_BUSINESS_CLOUD_ROUTE,
  CATALOG_FACEBOOK_ROUTE,
  CATALOG_CHAT_PLUGIN_ROUTE,
  CATALOG_TWILIO_SMS_ROUTE,
  CATALOG_TWILIO_WHATSAPP_ROUTE,
  CATALOG_WHATSAPP_BUSINESS_CLOUD_ROUTE,
  CATALOG_GOOGLE_ROUTE,
  CATALOG_INSTAGRAM_ROUTE,
  CATALOG_DIALOGFLOW_ROUTE,
  CATALOG_ZENDESK_ROUTE,
  CATALOG_SALESFORCE_ROUTE,
  CATALOG_CONGNIFY_ROUTE,
  CATALOG_AMELIA_ROUTE,
  CATALOG_FRONTEND_INBOX_ROUTE,
  CATALOG_RASA_ROUTE,
  CATALOG_WEBHOOKS_ROUTE,
  CATALOG_MOBILE_ROUTE,
  CATALOG_VIBER_ROUTE,
} from '../routes/routes';

export const getConnectedRouteForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return CONNECTORS_CHAT_PLUGIN_CONNECTED_ROUTE;
    case 'Facebook Messenger':
      return CONNECTORS_FACEBOOK_CONNECTED_ROUTE;
    case 'Twilio SMS':
      return CONNECTORS_TWILIO_SMS_CONNECTED_ROUTE;
    case 'Twilio WhatsApp':
      return CONNECTORS_TWILIO_WHATSAPP_CONNECTED_ROUTE;
    case 'WhatsApp Business Cloud':
      return CONNECTORS_WHATSAPP_BUSINESS_CLOUD_CONNECTED_ROUTE;
    case 'Google Business Messages':
      return CONNECTORS_GOOGLE_CONNECTED_ROUTE;
    case 'Instagram':
      return CONNECTORS_INSTAGRAM_CONNECTED_ROUTE;
    case 'Dialogflow':
      return CONNECTORS_DIALOGFLOW_ROUTE + '/new';
    case 'Salesforce':
      return CONNECTORS_SALESFORCE_ROUTE + '/new';
    case 'Zendesk':
      return CONNECTORS_ZENDESK_ROUTE + '/new';
  }
};

export const getNewChannelRouteForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return CONNECTORS_CHAT_PLUGIN_ROUTE + '/new';
    case 'Facebook Messenger':
      return CONNECTORS_FACEBOOK_ROUTE + '/new';
    case 'Twilio SMS':
      return CONNECTORS_TWILIO_SMS_ROUTE + '/new';
    case 'Twilio WhatsApp':
      return CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new';
    case 'WhatsApp Business Cloud':
      return CONNECTORS_WHATSAPP_BUSINESS_CLOUD_ROUTE + '/new';
    case 'Google Business Messages':
      return CONNECTORS_GOOGLE_ROUTE + '/new';
    case 'Instagram':
      return CONNECTORS_INSTAGRAM_ROUTE + '/new';
    case 'Dialogflow':
      return CONNECTORS_DIALOGFLOW_ROUTE + '/new';
    case 'Salesforce':
      return CONNECTORS_SALESFORCE_ROUTE + '/new';
    case 'Zendesk':
      return CONNECTORS_ZENDESK_ROUTE + '/new';
  }
};

export const getCatalogProductRouteForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return CATALOG_CHAT_PLUGIN_ROUTE;
    case 'Facebook Messenger':
      return CATALOG_FACEBOOK_ROUTE;
    case 'Twilio SMS':
      return CATALOG_TWILIO_SMS_ROUTE;
    case 'Twilio WhatsApp':
      return CATALOG_TWILIO_WHATSAPP_ROUTE;
    case 'WhatsApp Business Cloud':
      return CATALOG_WHATSAPP_BUSINESS_CLOUD_ROUTE;
    case 'Google Business Messages':
      return CATALOG_GOOGLE_ROUTE;
    case 'Instagram':
      return CATALOG_INSTAGRAM_ROUTE;
    case 'Dialogflow':
      return CATALOG_DIALOGFLOW_ROUTE;
    case 'Salesforce':
      return CATALOG_SALESFORCE_ROUTE;
    case 'Zendesk':
      return CATALOG_ZENDESK_ROUTE;
    case 'Congnigy':
      return CATALOG_CONGNIFY_ROUTE;
    case 'Amelia':
      return CATALOG_AMELIA_ROUTE;
    case 'Inbox':
      return CATALOG_FRONTEND_INBOX_ROUTE;
    case 'Rasa':
      return CATALOG_RASA_ROUTE;
    case 'Mobile':
      return CATALOG_MOBILE_ROUTE;
    case 'Webhooks':
      return CATALOG_WEBHOOKS_ROUTE;
    case 'Viber':
      return CATALOG_VIBER_ROUTE;
  }
};
