import {Config} from 'model';
import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {HttpClientInstance} from '../../httpClient';

const ADD_CONFIG_TO_STORE = 'ADD_CONFIG_TO_STORE';

export const saveClientConfig = createAction(ADD_CONFIG_TO_STORE, (config: Config) => config)<Config>();

export const getClientConfig = () => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.getConfig().then((response: Config) => {
    dispatch(saveClientConfig(response));
  });
