import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {Conversation, Pagination} from 'model';
import {PaginatedResponse} from 'httpclient/src';
import {HttpClientInstance} from '../../httpClient';
import {StateModel} from '../../reducers';
import {setMetadataAction} from '../metadata';

const CONVERSATION_LOADING = '@@conversation/LOADING';
const CONVERSATIONS_LOADING = '@@conversations/LOADING';
const CONVERSATIONS_MERGE = '@@conversations/MERGE';
const CONVERSATION_ADD_ERROR = '@@conversations/ADD_ERROR_TO_CONVERSATION';
const CONVERSATION_REMOVE_ERROR = '@@conversations/REMOVE_ERROR_FROM_CONVERSATION';
const CONVERSATION_REMOVE_TAG = '@@conversations/CONVERSATION_REMOVE_TAG';
const CONVERSATION_UPDATE_PAGINATION_DATA = '@@conversation/UPDATE_PAGINATION_DATA';
const CONVERSATION_SET_STATE = '@@conversations/CONVERSATION_SET_STATE';
const CONVERSATION_UPDATE_CONTACT = '@@conversations/CONVERSATION_UPDATE_CONTACT';

export const loadingConversationAction = createAction(
  CONVERSATION_LOADING,
  (conversationId: string) => conversationId
)<string>();

export const loadingConversationsAction = createAction(
  CONVERSATIONS_LOADING,
  (isLoading: boolean) => isLoading
)<boolean>();

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

export const setStateConversationAction = createAction(
  CONVERSATION_SET_STATE,
  (conversationId: string, state: string) => ({conversationId, state})
)<{conversationId: string; state: string}>();

export const updateContactAction = createAction(
  CONVERSATION_UPDATE_CONTACT,
  (conversationId: string, displayName: string) => ({
    conversationId,
    displayName,
  })
)<{conversationId: string; displayName: string}>();

export const fetchConversations = () => async (dispatch: Dispatch<any>) => {
  dispatch(loadingConversationsAction(true));
  return HttpClientInstance.listConversations({page_size: 50}).then((response: PaginatedResponse<Conversation>) => {
    dispatch(mergeConversationsAction(response.data, response.paginationData));
    dispatch(loadingConversationsAction(false));
    return Promise.resolve(true);
  });
};

export const fetchNextConversationPage = () => async (dispatch: Dispatch<any>, state: () => StateModel) => {
  const cursor = state().data.conversations.all.paginationData.nextCursor;

  dispatch(loadingConversationsAction(true));
  return HttpClientInstance.listConversations({cursor: cursor}).then((response: PaginatedResponse<Conversation>) => {
    dispatch(mergeConversationsAction(response.data, response.paginationData));
    dispatch(loadingConversationsAction(false));
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

export const conversationState = (conversationId: string, state: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.setStateConversation({conversationId, state}).then(() => {
    dispatch(setStateConversationAction(conversationId, state));
  });
};

export const addTagToConversation = (conversationId: string, tagId: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.tagConversation({conversationId, tagId}).then(() =>
    dispatch(
      setMetadataAction({
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

export const updateContact = (conversationId: string, displayName: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.updateContact({conversationId, displayName}).then(() =>
    dispatch(updateContactAction(conversationId, displayName))
  );
};
