import _typesafe, {createAction} from 'typesafe-actions';
import {apiHostUrl, HttpClientInstance} from '../../httpClient';
import {Dispatch} from 'react';

const SET_TOPICS = '@@metadata/SET_TOPICS';

export const getTopics = () => async (dispatch: Dispatch<any>) => {
  return getData('subjects').then(response => {
    dispatch(setTopicsAction(response));
    return Promise.resolve(true);
  });
};

async function getData(url: string) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'GET',
  });
  return response.json();
}

export const setTopicsAction = createAction(SET_TOPICS, (topics: string[]) => topics)<string[]>();
