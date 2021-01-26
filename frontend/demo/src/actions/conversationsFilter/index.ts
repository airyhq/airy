import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Conversation, ConversationFilter, ResponseMetadataPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

import {StateModel} from '../../reducers';
import {loadingConversationsAction} from '../conversations';

export const RESET_FILTERED_CONVERSATIONS = '@@conversations/RESET_FILTEREDS';
export const MERGE_FILTERED_CONVERSATIONS = '@@conversations/MERGE_FILTERED';
export const UPDATE_CONVERSATION_FILTER = '@@conversation/update_filter';

export const resetFilteredConversationAction = createAction(RESET_FILTERED_CONVERSATIONS);
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
  return HttpClientInstance.listConversations({
    page_size: 10,
    cursor,
    filters: filterToLuceneSyntax(filter),
  })
    .then((response: {data: Conversation[]; metadata: ResponseMetadataPayload}) => {
      dispatch(mergeFilteredConversationsAction(response.data, filter, response.metadata));
      return Promise.resolve(true);
    })
    .catch((error: Error) => {
      return Promise.reject(error);
    });
};

const filterToLuceneSyntax = (filter: ConversationFilter): string | null => {
  let filterQuery = '';
  if (filter.unreadOnly) {
    filterQuery = 'unread_count:[1 TO *]';
  } else if (filter.readOnly) {
    filterQuery = 'unread_count:0';
  }
  if (filter.displayName) {
    if (filterQuery === '') {
      filterQuery = 'display_name:*' + filter.displayName + '*';
    } else {
      filterQuery += ' AND display_name:*' + filter.displayName + '*';
    }
  }
  if (filter.byTags && filter.byTags.length > 0) {
    if (filterQuery === '') {
      filterQuery = 'tag_id:(' + filter.byTags.join(' ') + ')';
    } else {
      filterQuery += ' AND tag_id:(' + filter.byTags.join(' ') + ')';
    }
  }
  if (filter.byChannels && filter.byChannels.length > 0) {
    if (filterQuery === '') {
      filterQuery = 'channel_id:(' + filter.byChannels.join(' ') + ')';
    } else {
      filterQuery += ' AND channel_id:(' + filter.byChannels.join(' ') + ')';
    }
  }
  if (filter.bySources && filter.bySources.length > 0) {
    if (filterQuery === '') {
      filterQuery = 'source:(' + filter.bySources.join(' ') + ')';
    } else {
      filterQuery += ' AND source:(' + filter.bySources.join(' ') + ')';
    }
  }

  console.log(filterQuery);

  return filterQuery === '' ? null : filterQuery;
};
