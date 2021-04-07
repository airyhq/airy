import {mapMessage} from '../model';

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const listMessagesDef = {
  endpoint: 'messages.list',
  mapRequest: conversationListRequest => {
    conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;
    return {
      conversation_id: conversationListRequest.conversationId,
      cursor: conversationListRequest.cursor,
      page_size: conversationListRequest.pageSize,
    };
  },
  mapResponse: response => {
    const mappedMessageData = response.data.map(messagePayload => mapMessage(messagePayload));

    return {data: mappedMessageData, paginationData: camelcaseKeys(response.pagination_data)};
  },
};
