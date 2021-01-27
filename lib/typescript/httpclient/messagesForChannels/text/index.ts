import {SendMessagesRequestPayload} from '../../payload/SendMessagesRequestPayload';

export const getTextMesssagePayload = (channel: string, conversationId: string, text: string): SendMessagesRequestPayload => {
  let payload: SendMessagesRequestPayload;
  switch (channel) {
    case 'chat_plugin' || 'twillo.sms' ||'google' || 'facebook' ||'twillo.whatsapp':        
      payload = {
        conversationId,
        message: {
          text,
        },
      }
      return payload;    
    default:
      payload = {
        conversationId,
        message: {
          text,
        },
      }
      return payload;
  }
};


