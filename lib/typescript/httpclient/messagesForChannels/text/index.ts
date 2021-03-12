import {SendMessagesRequestPayload} from '../../payload/SendMessagesRequestPayload';

export const getTextMessagePayload = (
  channel: string,
  conversationId: string,
  text: string
): SendMessagesRequestPayload => {
  switch (channel) {
    case 'google':
      return {
        conversationId,
        message: {
          text,
          representative: {
            representativeType: 'HUMAN',
          },
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
