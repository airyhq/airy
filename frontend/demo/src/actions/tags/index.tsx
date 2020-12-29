import _, {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {AiryHttpClient, Tag, CreateTagRequestPayload, GetTagsResponse, tagsMapper} from 'httpclient';

const UPSERT_TAG = 'UPSERT_TAG';
const DELETE_TAG = 'DELETE_TAG';
const EDIT_TAG = 'EDIT_TAG';
const ERROR_TAG = 'ERROR_TAG';
const ADD_TAGS_TO_STORE = 'ADD_TAGS_TO_STORE';
const SET_TAG_FILTER = 'SET_TAG_FILTER';

export const fetchTagAction = createAction(ADD_TAGS_TO_STORE, resolve => (tags: Tag[]) => resolve(tags));
export const addTagAction = createAction(UPSERT_TAG, resolve => (tag: Tag) => resolve(tag));
export const editTagAction = createAction(EDIT_TAG, resolve => (tag: Tag) => resolve(tag));
export const deleteTagAction = createAction(DELETE_TAG, resolve => (id: string) => resolve(id));
export const filterTagAction = createAction(SET_TAG_FILTER, resolve => (filter: string) => resolve(filter));
export const errorTagAction = createAction(ERROR_TAG, resolve => (status: string) => resolve(status));

export function getTags() {
  return function(dispatch: Dispatch<any>) {
    return AiryHttpClient.getTags()
      .then((response: GetTagsResponse) => {
        dispatch(fetchTagAction(tagsMapper(response.data)));
      })
      .catch((error: Error) => {
        return error;
      });
  };
}

export function createTag(requestPayload: CreateTagRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return AiryHttpClient.createTag(requestPayload)
      .then((response: Tag) => {
        dispatch(addTagAction(response));
        return Promise.resolve(true);
      })
      .catch((error: string) => {
        dispatch(errorTagAction(error));
        return Promise.resolve(false);
      });
  };
}

export function updateTag(tag: Tag) {
  return function(dispatch: Dispatch<any>) {
    AiryHttpClient.updateTag(tag)
      .then(() => dispatch(editTagAction(tag)))
      .catch((error: Error) => {
        return error;
      });
  };
}

export function deleteTag(id: string) {
  return function(dispatch: Dispatch<any>) {
    AiryHttpClient.deleteTag(id)
      .then(() => {
        dispatch(deleteTagAction(id));
      })
      .catch((error: Error) => {
        return error;
      });
  };
}

export function filterTags(filter: string) {
  return function(dispatch: Dispatch<any>) {
    dispatch(filterTagAction(filter));
  };
}

export function errorTag(status: string) {
  return function(dispatch: Dispatch<any>) {
    dispatch(errorTagAction(status));
  };
}
