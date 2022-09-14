import {mapMessage} from 'model';
import camelcaseKeys from 'camelcase-keys';

export const listMessagesDef = {
  endpoint: 'messages.list',
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
