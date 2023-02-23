import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {Dispatch} from 'react';

const SET_TOPICS = '@@metadata/SET_TOPICS';

export const getTopics = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getTopics().then((response: string[]) => {   
    console.log(response) 
    dispatch(setTopicsAction(response));
    return Promise.resolve(true);
  });
};

export const setTopicsAction = createAction(SET_TOPICS, (topics: string[]) => topics)<string[]>();
