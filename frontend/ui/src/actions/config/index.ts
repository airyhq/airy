import {ConfigPayload} from 'httpclient';
import _, {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {HttpClientInstance} from '../../InitializeAiryApi';

const ADD_SETTINGS_TO_STORE = 'ADD_CONFIG_TO_STORE';

export const saveClientConfig = createAction(ADD_SETTINGS_TO_STORE, resolve => (config: ConfigPayload) =>
  resolve(config)
);

export const getClientConfig = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getConfig().then((response: ConfigPayload) => {
    dispatch(saveClientConfig(response));
    return Promise.resolve(true);
  });
};
