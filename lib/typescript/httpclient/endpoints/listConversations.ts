import {doFetchFromBackend} from '../api';
import {ListConversationsRequestPayload} from '../payload';
import {ConversationPayload} from '../payload/ConversationPayload';
import {PaginatedPayload} from '../payload/PaginatedPayload';
import {conversationsMapper} from '../mappers/conversationsMapper';

export function listConversations(conversationListRequest: ListConversationsRequestPayload) {
  conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  return doFetchFromBackend('conversations.list', conversationListRequest)
    .then((response: PaginatedPayload<ConversationPayload>) => {
      const {responseMetadata} = response;
      return {data: conversationsMapper(response.data), metadata: responseMetadata};
    })
    .catch((error: Error) => {
      return error;
    });
}
