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

export const setTopicSchema = (topicName: string, schema: string) => async () => {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`subjects/${topicName + '-value'}/versions`, body).then(response => {
    if (response.ok && response.id) return Promise.resolve(true);
    if (response.message) return Promise.reject(response.message);
    return Promise.reject('Unknown Error');
  });
};

export const checkCompatibilityOfNewSchema = (topicName: string, schema: string) => async () => {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`compatibility/subjects/${topicName + '-value'}/versions/latest`, body).then(response => {
    if (response.is_compatible !== undefined) {
      if (response.is_compatible === true) {
        return Promise.resolve(true);
      }
      return Promise.reject('Schema Not Compatible');
    }
    if (response.message) return Promise.reject(response.message);
    return Promise.reject('Unknown Error');
  });
};

async function getData(url: string) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'GET',
  });
  return response.json();
}

async function postData(url: string, body: any) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.schemaregistry.v1+json',
    },
    body: JSON.stringify(body),
  });

  try {
    return await response.json();
  } catch {
    return;
  }
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
