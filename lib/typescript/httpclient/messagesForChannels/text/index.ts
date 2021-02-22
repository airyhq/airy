import {SendMessagesRequestPayload} from '../../payload/SendMessagesRequestPayload';

export const getTextMessagePayload = (
  channel: string,
  conversationId: string,
  text: string
): SendMessagesRequestPayload => {
  let payload: SendMessagesRequestPayload;
  switch (channel) {
    case 'chat_plugin' || 'twilio.sms' || 'google' || 'facebook' || 'twilio.whatsapp':
      payload = {
        conversationId,
        message: {
          text,
        },
      };
      return payload;
    default:
      payload = {
        conversationId,
        message: {
          text,
        },
      };
      return payload;
  }
};
