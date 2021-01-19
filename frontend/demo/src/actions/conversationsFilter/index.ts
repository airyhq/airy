import {pickBy} from 'lodash-es';
import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import { HttpClient, Conversation, ConversationFilter, ResponseMetadataPayload } from 'httpclient';

import {StateModel} from '../../reducers';
import { loadingConversationsAction, mergeConversationsAction } from '../conversations';

export const RESET_FILTERED_CONVERSATIONS = '@@conversations/RESET_FILTEREDS';
export const MERGE_FILTERED_CONVERSATIONS = '@@conversations/MERGE_FILTERED';
export const UPDATE_CONVERSATION_FILTER = '@@conversation/update_filter';

export const resetFilteredConversationAction = createAction(RESET_FILTERED_CONVERSATIONS);
export const mergeFilteredConversationsAction = createAction(
  MERGE_FILTERED_CONVERSATIONS,
  resolve => (conversations: Conversation[], filter: ConversationFilter, metadata: ResponseMetadataPayload) =>
    resolve({conversations, filter, metadata})
);
export const updateFilteredConversationsAction = createAction(UPDATE_CONVERSATION_FILTER, resolve => (filter: ConversationFilter) =>
  resolve({filter})
);

export const setFilter = (filter: ConversationFilter) => {
  return (dispatch: Dispatch<any>, state: () => StateModel) => {
    const currentFilter = {
      ...state().data.conversations.filtered.currentFilter,
      ...filter,
    };
    executeFilter(currentFilter, dispatch, state);
  };
};

export const resetFilter = () => {
  return function(dispatch: Dispatch<any>, state: () => StateModel) {
    dispatch(resetFilteredConversationAction());
    const currentFilter = state().data.conversations.filtered.currentFilter;
    executeFilter(
      {
        displayName: currentFilter.displayName,
      },
      dispatch,
      state
    );
  };
};

const executeFilter = (filter: ConversationFilter, dispatch: Dispatch<any>, state: () => StateModel) => {
  dispatch(
    updateFilteredConversationsAction(
      pickBy(filter, value => {
        return value !== null && value !== undefined;
      })
    )
  );

  refetchConversations(dispatch, state);
};

const refetchConversations = (dispatch: Dispatch<any>, state: () => StateModel, cursor?: string) => {
  dispatch(loadingConversationsAction());
  return HttpClient.listConversations({
    page_size: 10,
    filters: "unread_count:0"})
  .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
    dispatch(mergeConversationsAction(response.data, response.metadata));
    return Promise.resolve(true);
  })
  .catch((error: Error) => {
    return Promise.reject(error);
  });
};
