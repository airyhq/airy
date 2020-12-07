import _, {Dispatch} from 'redux';

import {doFetchFromBackend} from '../../api/airyConfig';
import {Tag, TagPayload, CreateTagRequestPayload, GetTagsResponse, tagsMapper} from '../../model/Tag';

export const UPSERT_TAG = 'UPSERT_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const EDIT_TAG = 'EDIT_TAG';
export const ERROR_TAG = 'ERROR_TAG';
export const ADD_TAGS_TO_STORE = 'ADD_TAGS_TO_STORE';
export const SET_TAG_FILTER = 'SET_TAG_FILTER';

export function fetchTags(tags: Tag[]) {
  return {
    type: ADD_TAGS_TO_STORE,
    tagData: tags,
  };
}

export function addTag(tag: Tag) {
  return {
    type: UPSERT_TAG,
    tagData: tag,
  };
}

export function editedTag(tag: Tag) {
  return {
    type: EDIT_TAG,
    tagData: {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    },
  };
}

export function errorTag(status: string) {
  return {
    type: ERROR_TAG,
    tagData: {
      status,
    },
  };
}

export function deleteConversationTag(id: string) {
  return {
    type: DELETE_TAG,
    tagData: {
      tag_id: id,
    },
  };
}

export function getTags(query: string = '') {
  return function(dispatch: Dispatch<any>) {
    return doFetchFromBackend('tags.list').then((response: GetTagsResponse) => {
      dispatch(fetchTags(tagsMapper(response.data)));
    });
  };
}

export function createTag(requestPayload: CreateTagRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('tags.create', requestPayload)
      .then((response: TagPayload) => {
        const tag: Tag = {
          id: response.id,
          name: requestPayload.name,
          color: requestPayload.color,
        };
        dispatch(addTag(tag));
        return Promise.resolve(true);
      })
      .catch(error => {
        dispatch(errorTag(error));
        return Promise.resolve(false);
      });
  };
}

export function updateTag(tag: Tag) {
  return function(dispatch: Dispatch<any>) {
    doFetchFromBackend('tags.update', {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }).then((responseTag: Tag) => dispatch(editedTag(tag)));
  };
}

export function deleteTag(id: string) {
  return function(dispatch: Dispatch<any>) {
    doFetchFromBackend('tags.delete', {
      id
    }).then(() => {
      dispatch(deleteConversationTag(id));
    });
  };
}

export function filterTags(filter: string) {
  return function(dispatch: Dispatch<any>) {
    dispatch({
      type: SET_TAG_FILTER,
      payload: filter,
    });
  };
}
