import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {Conversation, Pagination} from 'model';
import {PaginatedResponse} from 'httpclient/src';
import {HttpClientInstance} from '../../httpClient';

import {ConversationFilter, StateModel} from '../../reducers';
import {loadingConversationsAction} from '../conversations';
import {delay, isEqual, omit} from 'lodash-es';

export const RESET_FILTERED_CONVERSATIONS = '@@conversations/RESET_FILTEREDS';
export const SET_FILTERED_CONVERSATIONS = '@@conversations/SET_FILTERED';
export const MERGE_FILTERED_CONVERSATIONS = '@@conversations/MERGE_FILTERED';
export const UPDATE_CONVERSATION_FILTER = '@@conversation/UPDATE_FILTER';

export const resetFilteredConversationAction = createAction(RESET_FILTERED_CONVERSATIONS)();
export const setFilteredConversationsAction = createAction(
  SET_FILTERED_CONVERSATIONS,
  (conversations: Conversation[], filter: ConversationFilter, paginationData: Pagination) => ({
    conversations,
    filter,
    paginationData,
  })
)<{conversations: Conversation[]; filter: ConversationFilter; paginationData: Pagination}>();

export const mergeFilteredConversationsAction = createAction(
  MERGE_FILTERED_CONVERSATIONS,
  (
    conversations: Conversation[],
    filter: ConversationFilter,
    paginationData: {previousCursor: string; nextCursor: string; total: number}
  ) => ({conversations, filter, paginationData})
)<{conversations: Conversation[]; filter: ConversationFilter; paginationData: Pagination}>();

export const updateFilteredConversationsAction = createAction(
  UPDATE_CONVERSATION_FILTER,
  (filter: ConversationFilter) => ({filter})
)<{filter: ConversationFilter}>();

export const setSearch = (currentFilter: ConversationFilter, displayName: string) => {
  const newFilter = omit({...currentFilter}, 'displayName');
  return displayName && displayName.length > 0 ? setFilter({...newFilter, displayName}) : setFilter(newFilter);
};

export const setFilter = (filter: ConversationFilter) => {
  return (dispatch: Dispatch<any>, state: () => StateModel) => {
    executeFilter(filter, dispatch, state);
  };
};

const executeFilter = (filter: ConversationFilter, dispatch: Dispatch<any>, state: () => StateModel) => {
  dispatch(updateFilteredConversationsAction(filter));
  fetchFilteredConversations(dispatch, state);
};

export const fetchNextFilteredPage = () => (dispatch: Dispatch<any>, state: () => StateModel) => {
  const cursor = state().data.conversations.filtered.paginationData.nextCursor;
  return fetchFilteredConversations(dispatch, state, cursor);
};

const fetchFilteredConversations = (dispatch: Dispatch<any>, state: () => StateModel, cursor?: string) => {
  dispatch(loadingConversationsAction(true));
  const filter = state().data.conversations.filtered.currentFilter;
  if (Object.keys(filter).length > 0) {
    delay(() => {
      if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
        return HttpClientInstance.listConversations({
          page_size: 50,
          cursor,
          filters: filterToLuceneSyntax(filter),
        }).then((response: PaginatedResponse<Conversation>) => {
          console.log('fetchFiltered response', response);
          if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
            if (cursor) {
              dispatch(mergeFilteredConversationsAction(response.data, filter, response.paginationData));
            } else {
              dispatch(setFilteredConversationsAction(response.data, filter, response.paginationData));
            }
            return Promise.resolve(true);
          }
        });
      }
      dispatch(loadingConversationsAction(false));
    }, 100);
  } else {
    dispatch(resetFilteredConversationAction());
    dispatch(loadingConversationsAction(false));
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
  if (filter.isStateOpen === true) {
    filterQuery.push('id:* AND NOT metadata.state:CLOSED');
  } else if (filter.isStateOpen !== undefined) {
    filterQuery.push('metadata.state:CLOSED');
  }
  return !filterQuery.length ? null : filterQuery.join(' AND ');
};
