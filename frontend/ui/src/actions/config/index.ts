import {Config} from 'model';
import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';

import {HttpClientInstance} from '../../httpClient';

const ADD_SETTINGS_TO_STORE = 'ADD_CONFIG_TO_STORE';

export const saveClientConfig = createAction(ADD_SETTINGS_TO_STORE, (config: Config) => config)<Config>();

export const getClientConfig = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getConfig().then((response: Config) => {
    dispatch(saveClientConfig(response));
    return Promise.resolve(true);
  });
};
