import {SendMessagesRequestPayload} from '../../payload/SendMessagesRequestPayload';

export const getTextMessagePayload = (
  channel: string,
  conversationId: string,
  text: string
): SendMessagesRequestPayload => {
  let payload: SendMessagesRequestPayload;
  switch (channel) {
    case 'chat_plugin' || 'twillo.sms' || 'facebook' || 'twillo.whatsapp':
      payload = {
        conversationId,
        message: {
          text,
        },
      };
      return payload;
    case 'google':
      payload = {
        conversationId,
        message: {
          text,
          representative: {
            representativeType: 'HUMAN',
          },
        },
      };
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
