import {Config} from 'model';
import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {EnableDisableComponentRequestPayload} from 'httpclient/src';

const ENABLE_DISABLE_COMPONENT = '@@config/ENABLE_DISABLE';
const ADD_SETTINGS_TO_STORE = '@@config/ADD_CONFIG_TO_STORE';

export const saveClientConfigAction = createAction(ADD_SETTINGS_TO_STORE, (config: Config) => config)<Config>();
export const enableDisableComponentAction = createAction(
  ENABLE_DISABLE_COMPONENT,
  (components: EnableDisableComponentRequestPayload) => components
)<EnableDisableComponentRequestPayload>();

export const getClientConfig = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getConfig().then((response: Config) => {
    dispatch(saveClientConfigAction(response));
    return Promise.resolve(true);
  });
};

export const enableDisableComponent =
  (enableDisableComponentRequestPayload: EnableDisableComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.enableDisableComponent(enableDisableComponentRequestPayload).then(() => {
      dispatch(enableDisableComponentAction(enableDisableComponentRequestPayload));
      return Promise.resolve(true);
    });
  };
