import {Config} from 'model';
import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';

import {HttpClientInstance} from '../../httpClient';
import {Settings} from "../../reducers";
import {saveSettings} from "../settings";

const ADD_CONFIG_TO_STORE = 'ADD_CONFIG_TO_STORE';
const ADD_SETTINGS_TO_STORE = 'ADD_SETTINGS_TO_STORE';

export const saveClientConfig = createAction(ADD_CONFIG_TO_STORE, (config: Config) => config)<Config>();



export const getClientConfig = () => {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.getConfig().then((response: Config) => {
      dispatch(saveClientConfig(response));
      dispatch(saveSettings(response));
      return Promise.resolve(true);
    });
  };
};
