import {doFetchFromBackend} from '../api';

export function readConversations(id: string) {
  return doFetchFromBackend('conversations.read', {id})
    .then(() => {
      return Promise.resolve(true);
    })
    .catch((error: Error) => {
      return Promise.reject(error);
    });
}
