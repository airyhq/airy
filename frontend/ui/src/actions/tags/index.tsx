import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';

import {Tag} from 'model';
import {CreateTagRequestPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const UPSERT_TAG = 'UPSERT_TAG';
const DELETE_TAG = 'DELETE_TAG';
const EDIT_TAG = 'EDIT_TAG';
const ERROR_TAG = 'ERROR_TAG';
const ADD_TAGS_TO_STORE = 'ADD_TAGS_TO_STORE';
const SET_TAG_FILTER = 'SET_TAG_FILTER';

export const fetchTagAction = createAction(ADD_TAGS_TO_STORE, (tags: Tag[]) => tags)<Tag[]>();
export const addTagAction = createAction(UPSERT_TAG, (tag: Tag) => tag)<Tag>();
export const editTagAction = createAction(EDIT_TAG, (tag: Tag) => tag)<Tag>();
export const deleteTagAction = createAction(DELETE_TAG, (id: string) => id)<string>();
export const filterTagAction = createAction(SET_TAG_FILTER, (filter: string) => filter)<string>();
export const errorTagAction = createAction(ERROR_TAG, (status: string) => status)<string>();

export function listTags() {
  return function (dispatch: Dispatch<any>) {
    return HttpClientInstance.listTags().then((response: Tag[]) => {
      dispatch(fetchTagAction(response));
    });
  };
}

export function createTag(requestPayload: CreateTagRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.createTag(requestPayload)
      .then((response: Tag) => {
        dispatch(addTagAction(response));
        return Promise.resolve(response);
      })
      .catch((error: string) => {
        dispatch(errorTagAction(error));
        return Promise.resolve(false);
      });
  };
}

export function updateTag(tag: Tag) {
  return function (dispatch: Dispatch<any>) {
    HttpClientInstance.updateTag(tag).then(() => dispatch(editTagAction(tag)));
  };
}

export function deleteTag(id: string) {
  return function (dispatch: Dispatch<any>) {
    HttpClientInstance.deleteTag(id).then(() => {
      dispatch(deleteTagAction(id));
    });
  };
}

export function filterTags(filter: string) {
  return function (dispatch: Dispatch<any>) {
    dispatch(filterTagAction(filter));
  };
}

export function errorTag(status: string) {
  return function (dispatch: Dispatch<any>) {
    dispatch(errorTagAction(status));
  };
}
