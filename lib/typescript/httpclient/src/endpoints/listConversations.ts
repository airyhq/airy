import {PaginatedPayload, ListConversationsRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {mapMessage} from 'model';

export const listConversationsDef = {
  endpoint: () => 'conversations.list',
  mapRequest: (conversationListRequest: ListConversationsRequestPayload) => {
    conversationListRequest.page_size = conversationListRequest.page_size ?? 50;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;
    return conversationListRequest;
  },
  mapResponse: response => {
    const conversationData = (response as PaginatedPayload<any>).data.map(messagePayload => ({
      ...camelcaseKeys(messagePayload, {
        deep: true,
        stopPaths: ['metadata.user_data', 'metadata.tags', 'metadata.notes'],
      }),
      createdAt: new Date(messagePayload.created_at),
      lastMessage: mapMessage(messagePayload.last_message),
    }));

    return {
      data: conversationData,
      paginationData: camelcaseKeys(response.pagination_data),
    };
  },
};
