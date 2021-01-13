import {doFetchFromBackend} from '../api';

export function readConversations(conversationId: string) {
  return doFetchFromBackend('conversations.read', {conversation_id: conversationId})
    .then(() => Promise.resolve(true))
    .catch((error: Error) => Promise.reject(error));
}
