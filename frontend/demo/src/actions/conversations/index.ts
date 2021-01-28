import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Conversation, PaginatedPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {StateModel} from '../../reducers';

export const CONVERSATION_LOADING = '@@conversation/LOADING';
export const CONVERSATIONS_LOADING = '@@conversations/LOADING';
export const CONVERSATIONS_MERGE = '@@conversations/MERGE';
export const CONVERSATION_ADD_ERROR = '@@conversations/ADD_ERROR_TO_CONVERSATION';
export const CONVERSATION_REMOVE_ERROR = '@@conversations/REMOVE_ERROR_FROM_CONVERSATION';
export const CONVERSATION_READ = '@@conversations/CONVERSATION_READ';
export const CONVERSATION_ADD_TAG = '@@conversations/CONVERSATION_ADD_TAG';
export const CONVERSATION_REMOVE_TAG = '@@conversations/CONVERSATION_REMOVE_TAG';
export const CONVERSATION_UPDATE_PAGINATION_DATA = '@@conversation/UPDATE_PAGINATION_DATA';

export const loadingConversationAction = createAction(CONVERSATION_LOADING, resolve => (conversationId: string) =>
  resolve(conversationId)
);

export const loadingConversationsAction = createAction(CONVERSATIONS_LOADING, resolve => () => resolve());

export const mergeConversationsAction = createAction(
  CONVERSATIONS_MERGE,
  resolve => (conversations: PaginatedPayload<Conversation>) => resolve({conversations})
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

export const addTagToConversationAction = createAction(
  CONVERSATION_ADD_TAG,
  resolve => (conversationId: string, tagId: string) => resolve({conversationId, tagId})
);

export const removeTagFromConversationAction = createAction(
  CONVERSATION_REMOVE_TAG,
  resolve => (conversationId: string, tagId: string) => resolve({conversationId, tagId})
);

export const updateMessagesPaginationDataAction = createAction(
  CONVERSATION_UPDATE_PAGINATION_DATA,
  resolve => (conversationId: string, pagination_data: {previous_cursor: string; next_cursor: string; total: number}) =>
    resolve({conversationId, pagination_data})
);

export function listConversations() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(loadingConversationsAction());
    return HttpClientInstance.listConversations({page_size: 10})
      .then((response: PaginatedPayload<Conversation>) => {
        dispatch(mergeConversationsAction(response));
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function listNextConversations() {
  return async (dispatch: Dispatch<any>, state: () => StateModel) => {
    const cursor = state().data.conversations.all.paginationData.next_cursor;

    dispatch(loadingConversationsAction());
    return HttpClientInstance.listConversations({cursor: cursor})
      .then((response: PaginatedPayload<Conversation>) => {
        dispatch(mergeConversationsAction(response));
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function readConversations(conversationId: string) {
  return function(dispatch: Dispatch<any>) {
    HttpClientInstance.readConversations(conversationId).then(() => dispatch(readConversationsAction(conversationId)));
  };
}

export function addTagToConversation(conversationId: string, tagId: string) {
  return function(dispatch: Dispatch<any>) {
    HttpClientInstance.tagConversation({conversationId, tagId}).then(() =>
      dispatch(addTagToConversationAction(conversationId, tagId))
    );
  };
}

export function removeTagFromConversation(conversationId: string, tagId: string) {
  return function(dispatch: Dispatch<any>) {
    HttpClientInstance.untagConversation({conversationId, tagId}).then(() =>
      dispatch(removeTagFromConversationAction(conversationId, tagId))
    );
  };
}
