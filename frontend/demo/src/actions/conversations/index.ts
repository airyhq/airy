import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {HttpClient, Conversation, ResponseMetadata} from 'httpclient';
import {StateModel} from '../../reducers';

export const CONVERSATION_LOADING = '@@conversation/LOADING';
export const CONVERSATIONS_LOADING = '@@conversations/LOADING';
export const CONVERSATIONS_MERGE = '@@conversations/MERGE';
export const CONVERSATION_ADD_ERROR = '@@conversations/ADD_ERROR_TO_CONVERSATION';
export const CONVERSATION_REMOVE_ERROR = '@@conversations/REMOVE_ERROR_FROM_CONVERSATION';

export const loadingConversationAction = createAction(CONVERSATION_LOADING, resolve => (conversationId: string) =>
  resolve(conversationId)
);

export const loadingConversationsAction = createAction(CONVERSATIONS_LOADING, resolve => () => resolve());

export const mergeConversationsAction = createAction(
  CONVERSATIONS_MERGE,
  resolve => (conversations: Conversation[], responseMetadata: ResponseMetadata) =>
    resolve({conversations, responseMetadata})
);

export const addErrorToConversationAction = createAction(
  CONVERSATION_ADD_ERROR,
  resolve => (conversationId: string, errorMessage: string) => resolve({conversationId, errorMessage})
);

export const removeErrorFromConversationAction = createAction(
  CONVERSATION_REMOVE_ERROR,
  resolve => (conversationId: string) => resolve({conversationId})
);

export function listConversations() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(loadingConversationsAction());
    return HttpClient.listConversations({page_size: 10})
      .then((response: {data: Conversation[]; metadata: ResponseMetadata}) => {
        dispatch(mergeConversationsAction(response.data, response.metadata));
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function listNextConversations() {
  return async (dispatch: Dispatch<any>, state: StateModel) => {
    const cursor = state.data.conversations.all.metadata.next_cursor;
    dispatch(loadingConversationsAction());
    return HttpClient.listNextConversations({cursor: cursor})
      .then((response: {data: Conversation[]; metadata: ResponseMetadata}) => {
        dispatch(mergeConversationsAction(response.data, response.metadata));
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}
