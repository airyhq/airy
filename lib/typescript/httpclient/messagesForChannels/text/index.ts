import {SendMessagesRequestPayload} from '../../payload/SendMessagesRequestPayload';

export const getTextMesssagePayload = (channel: string, conversationId: string, text: string): SendMessagesRequestPayload => {
  switch (channel) {
    case 'chat_plugin' || 'twillo.sms' ||'google' || 'facebook' ||'twillo.whatsapp':
        
      return {
        conversationId,
        message: {
          text,
        },
      };

    default:
      return {
        conversationId,
        message: {
          text,
        },
      };
  }
};


