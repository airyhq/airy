import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {Tag} from 'model';
import {CreateTagRequestPayload} from 'httpclient/src';
import {HttpClientInstance} from '../../httpClient';

const UPSERT_TAG = 'UPSERT_TAG';
const DELETE_TAG = 'DELETE_TAG';
const ERROR_TAG = 'ERROR_TAG';
const ADD_TAGS_TO_STORE = 'ADD_TAGS_TO_STORE';

export const fetchTagAction = createAction(ADD_TAGS_TO_STORE, (tags: Tag[]) => tags)<Tag[]>();
export const upsertTagAction = createAction(UPSERT_TAG, (tag: Tag) => tag)<Tag>();
export const deleteTagAction = createAction(DELETE_TAG, (id: string) => id)<string>();
export const errorTagAction = createAction(ERROR_TAG, (status: string) => status)<string>();

export function listTags() {
  return async function (dispatch: Dispatch<any>) {
    const response = await HttpClientInstance.listTags();
    dispatch(fetchTagAction(response));
  };
}

export function createTag(requestPayload: CreateTagRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.createTag(requestPayload)
      .then((response: Tag) => {
        dispatch(upsertTagAction(response));
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
    HttpClientInstance.updateTag(tag).then(() => dispatch(upsertTagAction(tag)));
  };
}

export function deleteTag(id: string) {
  return function (dispatch: Dispatch<any>) {
    HttpClientInstance.deleteTag(id).then(() => {
      dispatch(deleteTagAction(id));
    });
  };
}

export function errorTag(status: string) {
  return function (dispatch: Dispatch<any>) {
    dispatch(errorTagAction(status));
  };
}
