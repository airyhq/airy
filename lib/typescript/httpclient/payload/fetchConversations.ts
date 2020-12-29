import {doFetchFromBackend} from '../api';
import {ConversationPayload, ResponseMetadata, FetchConversationsResponse} from '../model';

export function fetchConversations() {
  return doFetchFromBackend('conversations.list', {
    page_size: 10,
  })
    .then((response: FetchConversationsResponse) => {
      return response;
    })
    .catch((error: Error) => {
      return error;
    });
}
