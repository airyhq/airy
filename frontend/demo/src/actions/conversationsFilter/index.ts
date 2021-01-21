import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import { Conversation, ConversationFilter, ResponseMetadataPayload } from 'httpclient';
import { HttpClientInstance } from '../../InitializeAiryApi';

import {StateModel} from '../../reducers';
import { loadingConversationsAction, mergeConversationsAction } from '../conversations';

export const RESET_FILTERED_CONVERSATIONS = '@@conversations/RESET_FILTEREDS';
export const MERGE_FILTERED_CONVERSATIONS = '@@conversations/MERGE_FILTERED';
export const UPDATE_CONVERSATION_FILTER = '@@conversation/update_filter';

export const resetFilteredConversationAction = createAction(RESET_FILTERED_CONVERSATIONS);
export const mergeFilteredConversationsAction = createAction(
  MERGE_FILTERED_CONVERSATIONS,
  resolve => (conversations: Conversation[], filter: string, metadata: ResponseMetadataPayload) =>
    resolve({conversations, filter, metadata})
);
export const updateFilteredConversationsAction = createAction(UPDATE_CONVERSATION_FILTER, resolve => (filter: string) =>
  resolve({filter})
);

export const setFilter = (filter: ConversationFilter) => {
  return (dispatch: Dispatch<any>, state: () => StateModel) => {
    const currentFilter = state().data.conversations.filtered.currentFilter
    if (currentFilter && !!currentFilter.length) {
      const newFilter = state().data.conversations.filtered.currentFilter + ' AND ' + filter;
      executeFilter(newFilter, dispatch, state);
    }    
    executeFilter(filter, dispatch, state);
  };
};

export const resetFilter = () => {
  return function(dispatch: Dispatch<any>, state: () => StateModel) {
    dispatch(resetFilteredConversationAction());
    const currentFilter = state().data.conversations.filtered.currentFilter;
    executeFilter(
      '',
      dispatch,
      state
    );
  };
};

const executeFilter = (filter: string, dispatch: Dispatch<any>, state: () => StateModel) => {
  dispatch(
    updateFilteredConversationsAction(filter)
  );

  refetchConversations(dispatch, state);
};

const refetchConversations = (dispatch: Dispatch<any>, state: () => StateModel, cursor?: string) => {
  dispatch(loadingConversationsAction());
  return HttpClientInstance.listConversations({
    page_size: 10,
    filters: state().data.conversations.filtered.currentFilter
  })
  .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
    dispatch(mergeConversationsAction(response.data, response.metadata));
    return Promise.resolve(true);
  })
  .catch((error: Error) => {
    return Promise.reject(error);
  });
};
