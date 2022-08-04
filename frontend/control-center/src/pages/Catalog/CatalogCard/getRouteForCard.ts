import {
    CONNECTORS_CHAT_PLUGIN_CONNECTED_ROUTE,
    CONNECTORS_FACEBOOK_CONNECTED_ROUTE,
    CONNECTORS_TWILIO_SMS_CONNECTED_ROUTE,
    CONNECTORS_TWILIO_WHATSAPP_CONNECTED_ROUTE,
    CONNECTORS_GOOGLE_CONNECTED_ROUTE,
    CONNECTORS_INSTAGRAM_CONNECTED_ROUTE,
    CONNECTORS_DIALOGFLOW_CONNECTED_ROUTE,
    CONNECTORS_ZENDESK_CONNECTED_ROUTE,
    CONNECTORS_SALESFORCE_CONNECTED_ROUTE,
    CONNECTORS_FACEBOOK_ROUTE,
    CONNECTORS_CHAT_PLUGIN_ROUTE,
    CONNECTORS_TWILIO_SMS_ROUTE,
    CONNECTORS_TWILIO_WHATSAPP_ROUTE,
    CONNECTORS_GOOGLE_ROUTE,
    CONNECTORS_INSTAGRAM_ROUTE,
    CONNECTORS_DIALOGFLOW_ROUTE,
    CONNECTORS_ZENDESK_ROUTE,
    CONNECTORS_SALESFORCE_ROUTE
  } from '../../../routes/routes';


export const getConnectedRouteForComponent = (displayName: string) => {
    switch (displayName) {
      case 'Airy Chat Plugin':
        return CONNECTORS_CHAT_PLUGIN_CONNECTED_ROUTE;
      case 'Facebook Messenger':
        return  CONNECTORS_FACEBOOK_CONNECTED_ROUTE;
      case 'Twilio SMS':
        return  CONNECTORS_TWILIO_SMS_CONNECTED_ROUTE;
      case 'Twilio WhatsApp':
        return CONNECTORS_TWILIO_WHATSAPP_CONNECTED_ROUTE;
      case 'Google Business Messages':
        return CONNECTORS_GOOGLE_CONNECTED_ROUTE;
      case 'Instagram':
        return CONNECTORS_INSTAGRAM_CONNECTED_ROUTE;
      case 'Dialogflow':
        return CONNECTORS_DIALOGFLOW_CONNECTED_ROUTE;
      case 'Salesforce':
        return CONNECTORS_SALESFORCE_CONNECTED_ROUTE;
      case 'Zendesk':
        return CONNECTORS_ZENDESK_CONNECTED_ROUTE;
    }
  };
  
  export const getNewChannelRouteForComponent = (displayName:string) => {
    switch (displayName) {
      case 'Airy Chat Plugin':
        return CONNECTORS_CHAT_PLUGIN_ROUTE + '/new';
      case 'Facebook Messenger':
        return  CONNECTORS_FACEBOOK_ROUTE + '/new';;
      case 'Twilio SMS':
        return  CONNECTORS_TWILIO_SMS_ROUTE + '/new';;
      case 'Twilio WhatsApp':
        return CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new';;
      case 'Google Business Messages':
        return CONNECTORS_GOOGLE_ROUTE + '/new';;
      case 'Instagram':
        return  CONNECTORS_INSTAGRAM_ROUTE + '/new';;
      case 'Dialogflow':
        return CONNECTORS_DIALOGFLOW_ROUTE + '/new';;
      case 'Salesforce':
        return CONNECTORS_SALESFORCE_ROUTE + '/new';;
      case 'Zendesk':
        return CONNECTORS_ZENDESK_ROUTE + '/new';;
    }
  
  }