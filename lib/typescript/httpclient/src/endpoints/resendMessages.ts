import {mapMessage} from 'model';

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const resendMessagesDef = {
  endpoint: 'messages.resend',
  mapRequest: conversationListRequest => {
    conversationListRequest.pageSize = conversationListRequest.pageSize ?? 50;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;
    return {
      conversation_id: conversationListRequest.conversationId,
      cursor: conversationListRequest.cursor,
      page_size: conversationListRequest.pageSize,
    };
  },
  mapResponse: response => ({
    data: response.data.map(messagePayload => mapMessage(messagePayload)),
    paginationData: camelcaseKeys(response.pagination_data),
  }),
};
