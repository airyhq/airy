import _typesafe, {createAction} from 'typesafe-actions';
import {apiHostUrl} from '../../httpClient';
import {Dispatch} from 'react';

const SET_TOPICS = '@@metadata/SET_TOPICS';
const SET_TOPIC_INFO = '@@metadata/SET_TOPICS_INFO';

export const getTopics = () => async (dispatch: Dispatch<any>) => {
  return getData('subjects').then(response => {
    dispatch(setTopicsAction(response));
    return Promise.resolve(true);
  });
};

export const getTopicInfo = (topicName: string) => async (dispatch: Dispatch<any>) => {
  return getData(`subjects/${topicName + '-value'}/versions/latest`).then(response => {
    dispatch(setCurrentTopicInfoAction(response));
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

export const setCurrentTopicInfoAction = createAction(
  SET_TOPIC_INFO,
  (topicInfo: {id: number; schema: string; subject: string; version: number}) => topicInfo
)<{
  id: number;
  schema: string;
  subject: string;
  version: number;
}>();
