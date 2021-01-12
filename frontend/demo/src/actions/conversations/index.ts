import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {HttpClient, Conversation} from 'httpclient';
import {ResponseMetadataPayload} from 'httpclient/payload/ResponseMetadataPayload';
import {StateModel} from '../../reducers';

export const CONVERSATION_LOADING = '@@conversation/LOADING';
export const CONVERSATIONS_LOADING = '@@conversations/LOADING';
export const CONVERSATIONS_MERGE = '@@conversations/MERGE';
export const CONVERSATION_ADD_ERROR = '@@conversations/ADD_ERROR_TO_CONVERSATION';
export const CONVERSATION_REMOVE_ERROR = '@@conversations/REMOVE_ERROR_FROM_CONVERSATION';
export const CONVERSATION_READ = '@@conversations/CONVERSATION_READ';

export const loadingConversationAction = createAction(CONVERSATION_LOADING, resolve => (conversationId: string) =>
  resolve(conversationId)
);

export const loadingConversationsAction = createAction(CONVERSATIONS_LOADING, resolve => () => resolve());

export const mergeConversationsAction = createAction(
  CONVERSATIONS_MERGE,
  resolve => (conversations: Conversation[], responseMetadata: ResponseMetadataPayload) =>
    resolve({conversations, responseMetadata})
);

export const readConversationsAction = createAction(CONVERSATION_READ, resolve => (conversationId: string) =>
  resolve({conversationId})
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
      .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
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
    const cursor = state.data.conversations.all.metadata.nextCursor;
    dispatch(loadingConversationsAction());
    return HttpClient.listConversations({cursor: cursor})
      .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
        dispatch(mergeConversationsAction(response.data, response.metadata));
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function readConversations(id: string) {
  return function(dispatch: Dispatch<any>) {
    HttpClient.readConversations(id).then(() => dispatch(readConversationsAction(id)));
  };
}
