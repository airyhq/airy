import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {Conversation, Pagination} from 'model';
import {PaginatedResponse} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {StateModel} from '../../reducers';
import {mergeMetadataAction, setMetadataAction} from '../metadata';

const CONVERSATION_LOADING = '@@conversation/LOADING';
const CONVERSATIONS_LOADING = '@@conversations/LOADING';
const CONVERSATIONS_MERGE = '@@conversations/MERGE';
const CONVERSATION_ADD_ERROR = '@@conversations/ADD_ERROR_TO_CONVERSATION';
const CONVERSATION_REMOVE_ERROR = '@@conversations/REMOVE_ERROR_FROM_CONVERSATION';
const CONVERSATION_REMOVE_TAG = '@@conversations/CONVERSATION_REMOVE_TAG';
const CONVERSATION_UPDATE_PAGINATION_DATA = '@@conversation/UPDATE_PAGINATION_DATA';

export const loadingConversationAction = createAction(
  CONVERSATION_LOADING,
  (conversationId: string) => conversationId
)<string>();

export const loadingConversationsAction = createAction(CONVERSATIONS_LOADING)();

export const mergeConversationsAction = createAction(
  CONVERSATIONS_MERGE,
  (conversations: Conversation[], paginationData?: Pagination) => ({
    conversations,
    paginationData,
  })
)<{conversations: Conversation[]; paginationData: Pagination}>();

export const addErrorToConversationAction = createAction(
  CONVERSATION_ADD_ERROR,
  (conversationId: string, errorMessage: string) => ({conversationId, errorMessage})
)<{conversationId: string; errorMessage: string}>();

export const removeErrorFromConversationAction = createAction(CONVERSATION_REMOVE_ERROR, (conversationId: string) => ({
  conversationId,
}))<{conversationId: string}>();

export const removeTagFromConversationAction = createAction(
  CONVERSATION_REMOVE_TAG,
  (conversationId: string, tagId: string) => ({conversationId, tagId})
)<{conversationId: string; tagId: string}>();

export const updateMessagesPaginationDataAction = createAction(
  CONVERSATION_UPDATE_PAGINATION_DATA,
  (conversationId: string, paginationData: Pagination) => ({conversationId, paginationData})
)<{conversationId: string; paginationData: Pagination}>();

export const listConversations = () => async (dispatch: Dispatch<any>) => {
  dispatch(loadingConversationsAction());
  return HttpClientInstance.listConversations({page_size: 10}).then((response: PaginatedResponse<Conversation>) => {
    dispatch(mergeConversationsAction(response.data, response.paginationData));
    return Promise.resolve(true);
  });
};

export const listNextConversations = () => async (dispatch: Dispatch<any>, state: () => StateModel) => {
  const cursor = state().data.conversations.all.paginationData.nextCursor;

  dispatch(loadingConversationsAction());
  return HttpClientInstance.listConversations({cursor: cursor}).then((response: PaginatedResponse<Conversation>) => {
    dispatch(mergeConversationsAction(response.data, response.paginationData));
    return Promise.resolve(true);
  });
};

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export const getConversationInfo = (conversationId: string, retries?: number) => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.getConversationInfo(conversationId)
    .then(response => {
      dispatch(mergeConversationsAction([response]));
      return Promise.resolve(true);
    })
    .catch(async (error: Error) => {
      if (retries > 5) {
        return Promise.reject(error);
      } else {
        await sleep(1000);
        return getConversationInfo(conversationId, retries ? retries + 1 : 1)(dispatch);
      }
    });

export const readConversations = (conversationId: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.readConversations(conversationId).then(() =>
    dispatch(
      setMetadataAction({
        subject: 'conversation',
        identifier: conversationId,
        metadata: {
          unreadCount: 0,
        },
      })
    )
  );
};

export const addTagToConversation = (conversationId: string, tagId: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.tagConversation({conversationId, tagId}).then(() =>
    dispatch(
      mergeMetadataAction({
        subject: 'conversation',
        identifier: conversationId,
        metadata: {
          tags: {
            [tagId]: '',
          },
        },
      })
    )
  );
};

export const removeTagFromConversation = (conversationId: string, tagId: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.untagConversation({conversationId, tagId}).then(() =>
    dispatch(removeTagFromConversationAction(conversationId, tagId))
  );
};
