import {doFetchFromBackend} from '../api';
import {FetchConversationsResponse} from '../model';

export function fetchNextConversations(cursor: string) {
  return doFetchFromBackend('conversations.list', {
    cursor,
  })
    .then((response: FetchConversationsResponse) => {
      return response;
    })
    .catch((error: Error) => {
      return error;
    });
}
