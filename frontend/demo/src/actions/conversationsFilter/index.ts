import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Conversation, ConversationFilter, ResponseMetadataPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

import {StateModel} from '../../reducers';
import {loadingConversationsAction} from '../conversations';
import {delay, isEqual} from 'lodash-es';

export const RESET_FILTERED_CONVERSATIONS = '@@conversations/RESET_FILTEREDS';
export const SET_FILTERED_CONVERSATIONS = '@@conversations/SET_FILTERED';
export const MERGE_FILTERED_CONVERSATIONS = '@@conversations/MERGE_FILTERED';
export const UPDATE_CONVERSATION_FILTER = '@@conversation/update_filter';

export const resetFilteredConversationAction = createAction(RESET_FILTERED_CONVERSATIONS);
export const setFilteredConversationsAction = createAction(
  SET_FILTERED_CONVERSATIONS,
  resolve => (conversations: Conversation[], filter: ConversationFilter, metadata: ResponseMetadataPayload) =>
    resolve({conversations, filter, metadata})
);
export const mergeFilteredConversationsAction = createAction(
  MERGE_FILTERED_CONVERSATIONS,
  resolve => (conversations: Conversation[], filter: ConversationFilter, metadata: ResponseMetadataPayload) =>
    resolve({conversations, filter, metadata})
);
export const updateFilteredConversationsAction = createAction(
  UPDATE_CONVERSATION_FILTER,
  resolve => (filter: ConversationFilter) => resolve({filter})
);

export const setSearch = (currentFilter: ConversationFilter, displayName: string) => {
  return setFilter({
    ...currentFilter,
    displayName,
  });
};

export const setFilter = (filter: ConversationFilter) => {
  return (dispatch: Dispatch<any>, state: () => StateModel) => {
    executeFilter(filter, dispatch, state);
  };
};

export const resetFilter = () => {
  return function(dispatch: Dispatch<any>, state: () => StateModel) {
    dispatch(resetFilteredConversationAction());
    const currentFilter = state().data.conversations.filtered.currentFilter;
    const newFilter: ConversationFilter = {displayName: currentFilter.displayName};
    executeFilter(newFilter, dispatch, state);
  };
};

const executeFilter = (filter: ConversationFilter, dispatch: Dispatch<any>, state: () => StateModel) => {
  dispatch(updateFilteredConversationsAction(filter));
  refetchConversations(dispatch, state);
};

const refetchConversations = (dispatch: Dispatch<any>, state: () => StateModel, cursor?: string) => {
  dispatch(loadingConversationsAction());
  const filter = state().data.conversations.filtered.currentFilter;
  if (Object.keys(filter).length > 0) {
    delay(() => {
      if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
        return HttpClientInstance.listConversations({
          page_size: 10,
          cursor,
          filters: filterToLuceneSyntax(filter),
        })
          .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
            if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
              if (cursor) {
                dispatch(mergeFilteredConversationsAction(response.data, filter, response.metadata));
              } else {
                dispatch(setFilteredConversationsAction(response.data, filter, response.metadata));
              }
              return Promise.resolve(true);
            }
          })
          .catch((error: Error) => {
            return Promise.reject(error);
          });
      }
    }, 100);
  } else {
    dispatch(resetFilteredConversationAction());
  }
};

const filterToLuceneSyntax = (filter: ConversationFilter): string | null => {
  const filterQuery: Array<string> = [];
  if (filter.unreadOnly) {
    filterQuery.push('unread_count:[1 TO *]');
  } else if (filter.readOnly) {
    filterQuery.push('unread_count:0');
  }
  if (filter.displayName) {
    filterQuery.push('display_name:*' + filter.displayName + '*');
  }
  if (filter.byTags && filter.byTags.length > 0) {
    filterQuery.push('tag_ids:(' + filter.byTags.join(' AND ') + ')');
  }
  if (filter.byChannels && filter.byChannels.length > 0) {
    filterQuery.push('channel_id:(' + filter.byChannels.join(' OR ') + ')');
  }
  if (filter.bySources && filter.bySources.length > 0) {
    filterQuery.push('source:(' + filter.bySources.join(' OR ') + ')');
  }
  return !filterQuery.length ? null : filterQuery.join(' AND ');
};
